const { query: Hasura } = require('../../../utils/hasura');
const { getUserThoughtsWithCognitoSub, getUserThoughts: getUserThoughtsQuery } = require('./queries/queries');
const cleanThoughtDoc = require('../../../utils/cleanThoughtDoc');
const catchAsync = require('../../../utils/catchAsync');

const getUserThoughts = catchAsync(async (req, res) => {
  const user_id = req.query.user_id;

  let variables = {
    cognito_sub: req.body.cognito_sub,
  };

  let query;

  if (!user_id) {
    query = getUserThoughtsWithCognitoSub;
  } else {
    variables['user_id'] = req.body.user_id;
    query = getUserThoughtsQuery;
  }

  const response = await Hasura(query, variables);

  if (!response.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  const cleanedThoughts = response.result.data.thoughts.map(cleanThoughtDoc);

  res.json(cleanedThoughts);
});

module.exports = getUserThoughts;
