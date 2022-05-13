const { query: Hasura } = require('../../../utils/hasura');
const { getUserId, getPendingConnection } = require('./queries/queries');
const { acceptConnection: acceptConnectionQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const acceptConnection = catchAsync(async (req, res) => {
  const { user_id, cognito_sub } = req.body;

  // Find user id
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });

  // Fetch connection
  // eslint-disable-next-line prefer-const
  let variables = {
    user2: response1.result.data.user[0].id,
    user1: user_id,
  };

  const response2 = await Hasura(getPendingConnection, variables);

  if (!response2.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  variables.formedAt = new Date().toISOString();

  const response3 = await Hasura(acceptConnectionQuery, variables);

  if (!response3.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response3.errors),
      data: null,
    });

  res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = acceptConnection;
