const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updatePost, updateRolesRequired, updateProjectFlags, updateDocuments, UpdateProjectTeam, updateProjectTags, deleteTeam } = require('./queries/mutations');
const createDefaultTeam = require('../../../utils/createDefaultTeam');

const updateProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id } = req.body;

  const variables = {
    id: {
      _eq: id,
    },
    changes: {},
  };

  if (req.body.description) variables.changes.description = req.body.description;
  if (req.body.title) variables.changes.title = req.body.title;
  if (req.body.link) variables.changes.link = req.body.link;
  if (req.body.status !== undefined) variables.changes.status = req.body.status;
  if (req.body.completed !== undefined) variables.changes.completed = req.body.completed;

  req.body.looking_for_members = req.body.looking_for_members || false;
  req.body.looking_for_mentors = req.body.looking_for_mentors || false;

  const response = await Hasura(updatePost, variables);
  const { user_id } = response.result.data.update_project.returning[0];
  let team_id;

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
    const teamName = req.body.team_name ? req.body.team_name : `${req.body.title} team`;
    const teamOnInovact = req.body.team_on_inovact;
    const teamCreated = await createDefaultTeam(user_id, teamName, req.body.looking_for_mentors, req.body.looking_for_members, teamOnInovact);
    variables.changes.team_id = teamCreated.team_id;
  } else if (req.body.looking_for_members === false && req.body.looking_for_mentors === false) {
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
