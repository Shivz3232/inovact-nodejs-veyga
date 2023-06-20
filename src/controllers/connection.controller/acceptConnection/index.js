const { query: Hasura } = require('../../../utils/hasura');
const { getUserId, getPendingConnection } = require('./queries/queries');
const { acceptConnection: acceptConnectionQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const notify = require('../../../utils/notify');
const logger = require('../../../config/logger');

const acceptConnection = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const user_id = req.query.user_id;
  // Find user id
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  // Fetch connection
  // eslint-disable-next-line prefer-const
  let variables = {
    user2: response1.result.data.user[0].id,
    user1: user_id,
  };

  const response2 = await Hasura(getPendingConnection, variables);

  if (!response2.success) {
    logger.error(JSON.stringify(response2.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });
  }

  if (response2.result.data.connections.length === 0 || response2.result.data.connections[0].status !== 'pending') {
    return res.json({
      success: false,
      errorCode: 'ConnectionNotFoundError',
      errorMessage: 'Connection not found',
      data: null,
    });
  }

  variables.formedAt = new Date().toISOString();

  const response3 = await Hasura(acceptConnectionQuery, variables);

  if (!response3.success) {
    logger.error(JSON.stringify(response3.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response3.errors),
      data: null,
    });
  }

  // Notify the user
  await notify(17, response2.result.data.connections[0].id, response2.result.data.connections[0].user2, [user_id]).catch(
    logger.debug
  );

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = acceptConnection;
