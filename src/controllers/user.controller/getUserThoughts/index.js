const { query: Hasura } = require('../../../utils/hasura');
const { getUserThoughtsWithCognitoSub, getUserThoughts: getUserThoughtsQuery } = require('./queries/queries');
const cleanThoughtDoc = require('../../../utils/cleanThoughtDoc');
const catchAsync = require('../../../utils/catchAsync');

const getUserThoughts = catchAsync(async (req, res) => {
  const user_id = req.query.user_id;
  const { cognito_sub } = req.body;

  let variables = {
    cognito_sub,
  };

  let query;

  if (!user_id) {
    query = getUserThoughtsWithCognitoSub;
  } else {
    variables['user_id'] = user_id;
    query = getUserThoughtsQuery;
  }

  const response = await Hasura(query, variables);

  const cleanedThoughts = response.result.data.thoughts.map(cleanThoughtDoc);

  return res.json(cleanedThoughts);
});

module.exports = getUserThoughts;
