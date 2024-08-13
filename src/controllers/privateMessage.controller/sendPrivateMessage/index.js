const { validationResult } = require('express-validator');
const { sendMessage } = require('./queries/mutations');
const { getConnectionDetails, getUserId } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');
const { KMSEncrypter: encrypt } = require('../../../utils/encrypt');
const { notify } = require('../../../utils/oneSignal');
const catchAsync = require('../../../utils/catchAsync');

const sendPrivateMessage = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, user_id, message } = req.body;

  // Check if logged in user is connected to the recipient
  const variables = {
    cognito_sub,
    user_id,
  };

  const response1 = await Hasura(getConnectionDetails, variables);

  if (response1.result.data.connections.length === 0)
    return res.status(400).json({
      success: false,
      errorCode: 'UserNotConnected',
      errorMessage: 'User is not connected to the recipient',
      data: null,
    });

  // Encrypt the message text
  const encryptedMessageBuffer = await encrypt(message);

  // Convert it to a string supported by Postgres for column type of bytea  (Byte Array)
  const encryptedMessageString = `\\x${encryptedMessageBuffer.toString('hex')}`;

  // Send the message
  const variables2 = {
    primary_user_id: response1.result.data.user[0].id,
    encrypted_message: encryptedMessageString,
    secondary_user_id: user_id,
    connection_id: response1.result.data.connections[0].id,
  };

  const response3 = await Hasura(sendMessage, variables2);

  // Notify the user
  const actorName = `${response1.result.data.user[0].first_name} ${response1.result.data.user[0].last_name}`;

  const notificationMessage = `${actorName} sent you a message`;
  notify(notificationMessage, [String(user_id)]);

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = sendPrivateMessage;
