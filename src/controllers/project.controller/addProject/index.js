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
    github_repo_url,
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
    github_repo_url,
    title,
    user_id: response1.result.data.user[0].id,
    status,
    completed,
    link,
  };

  let teamCreated;

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
  role_if: if (roles_required.length > 0 && projectData.team_id) {
    const roles_data = roles_required.map((ele) => {
      return {
        team_id: projectData.team_id,
        role_name: ele.role_type === 'mentor' ? '' : ele.role_name,
        role_type: ele.role_type,
      };
    });

    const response1 = await Hasura(addRolesRequired, { objects: roles_data });

    if (!response1.success) break role_if;

    const skills_data = [];

    for (const i in roles_required) {
      // eslint-disable-next-line no-prototype-builtins
      if (roles_required.hasOwnProperty(i)) {
        for (const skill of roles_required[i].skills_required) {
          skills_data.push({
            role_requirement_id:
              response1.result.data.insert_team_role_requirements.returning[i].id,
            skill_name: skill,
          });
        }
      }
    }

    await Hasura(addSkillsRequired, { objects: skills_data });
  }

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
  if (project_tags && project_tags.length) {
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
