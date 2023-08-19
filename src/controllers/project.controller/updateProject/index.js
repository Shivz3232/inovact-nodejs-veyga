const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updatePost_query } = require('./queries/queries');

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
  // if (req.body.caption) variables['changes']['caption'] = req.body.caption;
  if (req.body.description) variables.changes.description = req.body.description;
  if (req.body.title) variables.changes.title = req.body.title;
  if (req.body.link) variables.changes.link = req.body.link;

  const response = await Hasura(updatePost_query, variables);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
  });
});

module.exports = updateProject;
