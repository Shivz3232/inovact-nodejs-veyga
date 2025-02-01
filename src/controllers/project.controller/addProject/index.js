/* eslint-disable no-shadow */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
const { validationResult } = require('express-validator');
const {
  addProject: addProjectQuery,
  addMentions,
  addTags,
  addDocuments,
  addRolesRequired,
  addSkillsRequired,
  updateUserFlags,
} = require('./queries/mutations');
const { getUser, getMyConnections } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');
const enqueueEmailNotification = require('../../../utils/enqueueEmailNotification');
const insertUserActivity = require('../../../utils/insertUserActivity');
const notify = require('../../../utils/notify');
const cleanConnections = require('../../../utils/cleanConnections');
const catchAsync = require('../../../utils/catchAsync');
const createDefaultTeam = require('../../../utils/createDefaultTeam');

async function handleRoleUpdates(teamId, newRoles, Hasura) {
  // 1. Get current roles and their associated members and skills
  const currentRolesResponse = await Hasura(getRoleRequirements, {
    team_id: teamId,
  });

  const currentRoles = currentRolesResponse.result.data.team_role_requirements;

  // Create maps for easier lookup
  const currentRoleMap = new Map(currentRoles.map((role) => [role.role_name, role]));

  const newRoleMap = new Map(newRoles.map((role) => [role.role_name, role]));

  // Arrays to track what needs to be deleted, added, or updated
  const rolesToDelete = [];
  const rolesToAdd = [];
  const rolesToUpdate = [];

  // Find roles to delete or update
  for (const currentRole of currentRoles) {
    if (!newRoleMap.has(currentRole.role_name)) {
      // Role no longer exists in new roles - mark for deletion
      rolesToDelete.push(currentRole);
    } else {
      // Role exists but might need skill updates
      rolesToUpdate.push({
        roleId: currentRole.id,
        currentSkills: currentRole.team_skill_requirements.map((s) => s.skill_name),
        newSkills: newRoleMap.get(currentRole.role_name).skills_required,
        members: currentRole.team_members,
      });
    }
  }

  // Find completely new roles to add
  for (const newRole of newRoles) {
    if (!currentRoleMap.has(newRole.role_name)) {
      rolesToAdd.push(newRole);
    }
  }

  // Begin transaction for role updates
  try {
    // 1. Handle deletions first
    if (rolesToDelete.length > 0) {
      const roleIds = rolesToDelete.map((role) => role.id);
      const memberIdsToDelete = rolesToDelete
        .flatMap((role) => role.team_members)
        .map((member) => member.id);

      // Delete in correct order to maintain referential integrity
      if (memberIdsToDelete.length > 0) {
        await Hasura(deleteTeamMembers, { memberIds: memberIdsToDelete });
      }

      await Hasura(deleteRoleSkills, { roleIds });
      await Hasura(deleteRoles, { roleIds });
    }

    // 2. Handle updates
    for (const roleUpdate of rolesToUpdate) {
      // Update role name if needed
      const newRoleData = newRoleMap.get(currentRoleMap.get(roleUpdate.roleId)?.role_name);
      if (
        newRoleData &&
        newRoleData.role_name !== currentRoleMap.get(roleUpdate.roleId)?.role_name
      ) {
        await Hasura(updateRoleRequirement, {
          roleId: roleUpdate.roleId,
          roleName: newRoleData.role_name,
        });
      }

      // Update skills
      await Hasura(deleteRoleSkills, { roleIds: [roleUpdate.roleId] });

      if (newRoleData?.skills_required?.length > 0) {
        const skillsData = newRoleData.skills_required.map((skill) => ({
          role_requirement_id: roleUpdate.roleId,
          skill_name: skill,
        }));

        await Hasura(addSkillsRequired, { objects: skillsData });
      }
    }

    // 3. Handle additions
    if (rolesToAdd.length > 0) {
      const roles_data = rolesToAdd.map((role) => ({
        team_id: teamId,
        role_name: role.role_name,
      }));

      const rolesResponse = await Hasura(addRolesRequired, { objects: roles_data });

      if (rolesResponse.success) {
        const skills_data = [];

        for (let i = 0; i < rolesToAdd.length; i++) {
          const role = rolesToAdd[i];
          if (role.skills_required) {
            for (const skill of role.skills_required) {
              skills_data.push({
                role_requirement_id:
                  rolesResponse.result.data.insert_team_role_requirements.returning[i].id,
                skill_name: skill,
              });
            }
          }
        }

        if (skills_data.length > 0) {
          await Hasura(addSkillsRequired, { objects: skills_data });
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating roles:', error);
    throw error;
  }
}

const addProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const {
    cognito_sub,
    description,
    title,
    status,
    completed,
    link,
    looking_for_members,
    looking_for_mentors,
    roles_required,
    mentions,
    project_tags,
    documents,
  } = req.body;

  if (looking_for_members && roles_required.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'InvalidInput',
      errorMessage: "Roles required can't be empty when looking for members",
    });
  }

  // Find user id
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  const userEventFlags = response1.result.data.user[0].user_action;

  // Insert project
  const projectData = {
    description,
    title,
    user_id: response1.result.data.user[0].id,
    status,
    completed,
    link,
  };

  let teamCreated;

  // Create a default team

  if (looking_for_members || looking_for_mentors) {
    teamCreated = await createDefaultTeam(
      response1.result.data.user[0].id,
      req.body.team_name ? req.body.team_name : `${req.body.title} team`,
      req.body.looking_for_mentors,
      req.body.looking_for_members,
      req.body.team_on_inovact
    );
    projectData.team_id = teamCreated.team_id;
  } else {
    projectData.team_id = null;
  }

  const response2 = await Hasura(addProjectQuery, projectData);

  // Insert roles required and skills required
  await handleRoleUpdates;

  if (looking_for_members) {
    insertUserActivity('looking-for-team-member', 'positive', response1.result.data.user[0].id, [
      projectData.team_id,
    ]);
  }
  if (looking_for_mentors) {
    insertUserActivity('looking-for-team-mentor', 'positive', response1.result.data.user[0].id, [
      response2.result.data.insert_project.returning[0].id,
    ]);
  }

  // Insert mentions
  if (mentions) {
    const mentions = req.body.mentions.map((user_id) => {
      return {
        user_id,
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const mentionsData = {
      objects: mentions,
    };

    // @TODO Fallback if mentions fail to be inserted
    await Hasura(addMentions, mentionsData);
  }

  // Insert tags
  if (project_tags.length) {
    const tags = req.body.project_tags.map((tag_name) => {
      return {
        hashtag: {
          data: {
            name: tag_name.toLowerCase(),
          },
          on_conflict: {
            constraint: 'hashtag_tag_name_key',
            update_columns: 'name',
          },
        },
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const tagsData = {
      objects: tags,
    };

    // @TODO Fallback if tags fail to be inserted
    await Hasura(addTags, tagsData);
  }

  // Insert Documents
  if (documents && req.body.documents.length) {
    const documents = req.body.documents.map((document) => {
      return {
        name: document.name,
        url: document.url,
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const documentsData = {
      objects: documents,
    };

    // @TODO Fallback if documents fail to be inserted
    await Hasura(addDocuments, documentsData);
  }

  // Send email notification
  const { id: actorId } = response1.result.data.user[0];
  const { id: projectId } = response2.result.data.insert_project.returning[0];
  const { team_id: teamId } = projectData;

  // get connection usernids
  const getConnectionsResponse = await Hasura(getMyConnections, {
    cognito_sub,
  });

  const userConnectionIds = cleanConnections(
    getConnectionsResponse.result.data.connections,
    actorId
  );
  let isConnectionNotified = false;

  if (teamId) {
    // notify user what can he do next
    enqueueEmailNotification(3, projectId, actorId, [actorId]);

    // notify connections that the user is seeking ht ecollaborators
    if (userConnectionIds.length > 0) {
      enqueueEmailNotification(15, projectId, actorId, [actorId]);
      isConnectionNotified = true;
    }
  }

  // notifiing the user about the project but only when the connections were not notified before
  // Dont wanna spam
  if (userConnectionIds.length > 0 && !isConnectionNotified) {
    enqueueEmailNotification(2, projectId, actorId, userConnectionIds);
  }

  if (userConnectionIds.length > 0) {
    notify(3, projectId, actorId, userConnectionIds);
  }

  // Congratualting the user for the acheivment
  enqueueEmailNotification(1, projectId, actorId, [actorId]);
  // insertUserActivity();
  insertUserActivity('uploading-project', 'positive', actorId, [projectId]);

  const needsProjectUploadFlag = !userEventFlags.has_uploaded_project;
  const needsTeamFlag =
    userEventFlags.has_sought_team || userEventFlags.has_sought_team === looking_for_members;
  const needsMentorFlag =
    userEventFlags.has_sought_mentor || userEventFlags.has_sought_mentor === looking_for_mentors;
  const needsTeamAndMentorFlag = !userEventFlags.has_sought_team_and_mentor;

  if (needsProjectUploadFlag || (needsTeamFlag && needsMentorFlag) || needsTeamAndMentorFlag) {
    userEventFlags.has_uploaded_project = true;
    userEventFlags.has_sought_team = userEventFlags.has_sought_team || looking_for_members;
    userEventFlags.has_sought_mentor = userEventFlags.has_sought_mentor || looking_for_mentors;
    userEventFlags.has_sought_team_and_mentor =
      userEventFlags.has_sought_team_and_mentor || (looking_for_members && looking_for_mentors);

    await Hasura(updateUserFlags, {
      userId: actorId,
      userEventFlags,
    });
  }

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addProject;
