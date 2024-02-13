const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updatePost, updateRolesRequired, addRolesRequired, addSkillsRequired, updateProjectFlags, updateDocuments, UpdateProjectTeam, updateProjectTags, deleteTeam } = require('./queries/mutations');
const { getUserIdFromCognito } = require('./queries/queries');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const insertUserActivity = require('../../../utils/insertUserActivity');

const updateProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id, cognito_sub } = req.body;

  const variables = {
    id: {
      _eq: id,
    },
    changes: {},
  };

  const getUserIdFromCognitoResponse = await Hasura(getUserIdFromCognito, {
    cognito_sub,
  });

  if (req.body.description) variables.changes.description = req.body.description;
  if (req.body.title) variables.changes.title = req.body.title;
  if (req.body.link) variables.changes.link = req.body.link;
  if (req.body.status !== undefined) variables.changes.status = req.body.status;
  if (req.body.completed !== undefined) {
    variables.changes.completed = req.body.completed;
    insertUserActivity('ca3f952b-3fb8-406e-8abd-f345a723651b', 'positive', [getUserIdFromCognitoResponse.result.data.user[0].id]);
  }

  req.body.looking_for_members = req.body.looking_for_members || false;
  req.body.looking_for_mentors = req.body.looking_for_mentors || false;

  const response = await Hasura(updatePost, variables);
  const { user_id } = response.result.data.update_project.returning[0];
  let team_id;

  if (req.body.completed) {
    const projectFlagsUpdateVariables = {
      team_id: response.result.data.update_project.returning[0].team_id,
      lookingForMentors: false,
      lookingForMembers: false,
    };
    await Hasura(updateProjectFlags, projectFlagsUpdateVariables);

    await Hasura(deleteTeam, { team_id: response.result.data.update_project.returning[0].team_id });

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
    });
  }

  if (response.result.data.update_project.returning[0].team_id === null) {
    const teamName = req.body.team_name ? req.body.team_name : `${req.body.title} team`;
    const teamOnInovact = req.body.team_on_inovact;
    const teamCreated = await createDefaultTeam(user_id, teamName, req.body.looking_for_mentors, req.body.looking_for_members, teamOnInovact);
    team_id = teamCreated.team_id;
    await Hasura(UpdateProjectTeam, {
      projectId: id,
      newTeamId: team_id,
    });
  } else {
    team_id = response.result.data.update_project.returning[0].team_id;
  }

  console.log('team id ', team_id);

  if (req.body.looking_for_mentors !== undefined || req.body.looking_for_members !== undefined) {
    const projectFlagsUpdateVariables = {
      team_id,
      lookingForMentors: req.body.looking_for_mentors,
      lookingForMembers: req.body.looking_for_members,
    };
    await Hasura(updateProjectFlags, projectFlagsUpdateVariables);
  }

  if (req.body.looking_for_members || req.body.looking_for_mentors) {
    console.log('In here');
    if (req.body.roles_required && req.body.roles_required.length > 0) {
      if (team_id) {
        await Hasura(deleteTeam, { team_id });
        team_id = null;
      }
      const teamName = req.body.team_name ? req.body.team_name : `${req.body.title} team`;
      const teamOnInovact = req.body.team_on_inovact;
      const teamCreated = await createDefaultTeam(user_id, teamName, req.body.looking_for_mentors, req.body.looking_for_members, teamOnInovact);
      team_id = teamCreated.team_id;
      console.log(team_id);
    }

    await Hasura(UpdateProjectTeam, {
      projectId: id,
      newTeamId: team_id,
    });

    if (req.body.roles_required.length > 0 && team_id) {
      // Insert roles required and skills required
      role_if: if (req.body.roles_required && req.body.roles_required.length > 0 && team_id) {
        const { roles_required } = req.body;
        const roles_data = roles_required.map((ele) => {
          return {
            team_id,
            role_name: ele.role_name,
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
                role_requirement_id: response1.result.data.insert_team_role_requirements.returning[i].id,
                skill_name: skill,
              });
            }
          }
        }

        await Hasura(addSkillsRequired, { objects: skills_data });
      }
    }
  } else if (req.body.looking_for_members === false && req.body.looking_for_mentors === false && team_id) {
    await Hasura(deleteTeam, { team_id });
    variables.changes.team_id = null;
  }

  if (req.body.documents && req.body.documents.length > 0) {
    const documents = req.body.documents.map((document) => ({
      name: document.name,
      url: document.url,
      project_id: id,
    }));
    await Hasura(updateDocuments, { project_id: id, documents });
  }

  if (req.body.project_tags && req.body.project_tags.length > 0) {
    const tags = req.body.project_tags.map((tag_name) => ({
      hashtag: {
        data: {
          name: tag_name.toLowerCase(),
        },
        on_conflict: {
          constraint: 'hashtag_tag_name_key',
          update_columns: 'name',
        },
      },
      project_id: id,
    }));
    // Define variables object with projectId and tags
    const variables = {
      projectId: id,
      tags: tags,
    };

    // Execute the GraphQL mutation
    await Hasura(updateProjectTags, variables);
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
  });
});

module.exports = updateProject;
