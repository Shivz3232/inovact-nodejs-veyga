const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updatePost_query, updateRolesRequired, updateProjectFlags, updateDocuments, updateProjectTags, updateMentions } = require('./queries/mutations');
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

  const response = await Hasura(updatePost_query, variables);

  if (req.body.roles_required) {
    const rolesUpdateVariables = {
      projectId: id,
      newRoles: req.body.roles_required.map((role) => ({
        project_id: id,
        role_name: role.role_name,
      })),
    };
    await Hasura(updateRolesRequired, rolesUpdateVariables);
  }

  if (req.body.looking_for_mentors !== undefined || req.body.looking_for_members !== undefined) {
    const projectFlagsUpdateVariables = {
      projectId: id,
      lookingForMentors: req.body.looking_for_mentors,
      lookingForMembers: req.body.looking_for_members,
    };
    await Hasura(updateProjectFlags, projectFlagsUpdateVariables);
  }

  if (req.body.mentions) variables.changes.mentions = req.body.mentions;
  if (req.body.project_tags) variables.changes.project_tags = req.body.project_tags;
  if (req.body.documents) variables.changes.documents = req.body.documents;

  if (req.body.looking_for_members || req.body.looking_for_mentors) {
    const teamName = req.body.team_name ? req.body.team_name : `${req.body.title} team`;
    const teamOnInovact = req.body.team_on_inovact;
    const teamCreated = await createDefaultTeam(id, teamName, req.body.looking_for_mentors, req.body.looking_for_members, teamOnInovact);
    variables.changes.team_id = teamCreated.team_id;
  } else if (req.body.looking_for_members === false && req.body.looking_for_mentors === false) {
    variables.changes.team_id = null;
  }

  if (req.body.documents && req.body.documents.length > 0) {
    const documents = req.body.documents.map((document) => ({
      name: document.name,
      url: document.url,
      project_id: id,
    }));
    await Hasura(updateDocuments, { objects: documents });
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
    await Hasura(updateProjectTags, { objects: tags });
  }

  if (req.body.mentions && req.body.mentions.length > 0) {
    const mentions = req.body.mentions.map((user_id) => ({
      user_id,
      project_id: id,
    }));
    await Hasura(updateMentions, { objects: mentions });
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
  });
});

module.exports = updateProject;
