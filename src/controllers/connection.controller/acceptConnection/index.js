const { query: Hasura } = require('../../../utils/hasura');
const { getUserId, getPendingConnection } = require('./queries/queries');
const { acceptConnection: acceptConnectionQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const notify = require('../../../utils/notify');
const { validationResult } = require('express-validator');

const acceptConnection = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const { user_id } = req.query;
  // Find user id
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // Fetch connection
  // eslint-disable-next-line prefer-const
  let variables = {
    user2: response1.result.data.user[0].id,
    user1: user_id,
  };

  const response2 = await Hasura(getPendingConnection, variables);

  if (response2.result.data.connections.length === 0 || response2.result.data.connections[0].status !== 'pending') {
    return res.status(400).json({
      success: false,
      errorCode: 'ConnectionNotFoundError',
      errorMessage: 'Connection not found',
      data: null,
    });
  }

  variables.formedAt = new Date().toISOString();

  const response3 = await Hasura(acceptConnectionQuery, variables);

  // Notify the user
  await notify(17, response2.result.data.connections[0].id, response2.result.data.connections[0].user2, [user_id]).catch(logger.debug);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = acceptConnection;
