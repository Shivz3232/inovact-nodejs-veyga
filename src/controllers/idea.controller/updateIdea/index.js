const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updateIdea_query } = require('./queries/queries');
const { validationResult } = require('express-validator');

const updateIdeas = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id } = req.body;
  let variables = {
    id: {
      _eq: id,
    },
    changes: {},
  };

  const allowed_statuses = ['ideation', 'mvp/prototype', 'traction'];

  if (req.body.caption) variables['changes']['caption'] = req.body.caption;
  if (req.body.description) variables['changes']['description'] = req.body.description;
  if (req.body.title) variables['changes']['title'] = req.body.title;
  if (req.body.status && allowed_statuses.indexOf(req.body.status) > -1) variables['changes']['status'] = req.body.status;
  if (req.body.link) variables['changes']['link'] = req.body.link;

  const response = await Hasura(updateIdea_query, variables);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = updateIdeas;
