const { query: Hasura } = require('../../../utils/hasura');
const cleanIdeaDoc = require('../../../utils/cleanIdeaDoc');
const { getUserIdeasById, getUserIdeasByCognitoSub } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const { validationResult } = require('express-validator');

const getUserIdea = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  let { user_id } = req.query;
  const { cognito_sub } = req.body;

  let query;
  let variables = {
    cognito_sub,
  };

  if (user_id) {
    query = getUserIdeasById;
    variables.user_id = user_id;
  } else {
    query = getUserIdeasByCognitoSub;
  }

  const response = await Hasura(query, variables);

  const cleanedIdeas = response.result.data.idea.map(cleanIdeaDoc);

  res.json(cleanedIdeas);
});

module.exports = getUserIdea;
