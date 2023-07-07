const { query: Hasura } = require('../../../utils/hasura');
const { getUserId } = require('./queries/queries');
const { removeConnection: removeConnectionQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const removeConnection = catchAsync(async (req, res) => {
  const user_id = req.query.user_id;

  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // Fetch connection
  const variables = {
    user2: response1.result.data.user[0].id,
    user1: user_id,
  };

  const response2 = await Hasura(removeConnectionQuery, variables);

  return res.status(204).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});
module.exports = removeConnection;
