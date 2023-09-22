const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updatePost_query } = require('./queries/queries');
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
  if (req.body.looking_for_members !== undefined) variables.changes.looking_for_members = req.body.looking_for_members;
  if (req.body.looking_for_mentors !== undefined) variables.changes.looking_for_mentors = req.body.looking_for_mentors;
  if (req.body.roles_required) variables.changes.roles_required = req.body.roles_required;
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

  const response = await Hasura(updatePost_query, variables);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
  });
});

module.exports = updateProject;
