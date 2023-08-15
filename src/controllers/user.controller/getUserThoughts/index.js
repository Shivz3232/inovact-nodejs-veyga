const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserThoughtsWithCognitoSub, getUserThoughts: getUserThoughtsQuery } = require('./queries/queries');
const cleanThoughtDoc = require('../../../utils/cleanThoughtDoc');
const catchAsync = require('../../../utils/catchAsync');

const getUserThoughts = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { user_id } = req.query;
  const { cognito_sub } = req.body;

  const variables = {
    cognito_sub,
  };

  let query;

  if (!user_id) {
    query = getUserThoughtsWithCognitoSub;
  } else {
    variables.user_id = user_id;
    query = getUserThoughtsQuery;
  }

  const response = await Hasura(query, variables);

  const cleanedThoughts = response.result.data.thoughts.map(cleanThoughtDoc);

  return res.json(cleanedThoughts);
});

module.exports = getUserThoughts;
