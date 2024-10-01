const { query: Hasura } = require('../../../utils/hasura');
const { getUserThoughtsWithCognitoSub, getUserThoughts } = require('./queries/queries');
const cleanThoughtDoc = require('../../../utils/cleanThoughtDoc');
const catchAsync = require('../../../utils/catchAsync');

const getAllUserThoughts = catchAsync(async (req, res) => {
  const { user_id } = events;

  const variables = {
    cognito_sub: events.cognito_sub,
  };

  let query;

  if (!user_id) {
    query = getUserThoughtsWithCognitoSub;
  } else {
    variables.user_id = events.user_id;
    query = getUserThoughts;
  }

  const response = await Hasura(query, variables);

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  const cleanedThoughts = response.result.data.thoughts.map(cleanThoughtDoc);

  callback(null, cleanedThoughts);
});
