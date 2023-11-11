const { validationResult } = require('express-validator');
const { getPrivateMessages } = require('./queries/queries');
const { decryptMessage } = require('../../../utils/decryptMessages');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const getLatestPrivateMessage = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const { user_id, timeStamp } = req.query;

  const variables = {
    cognito_sub,
    user_id,
    timeStamp: timeStamp || new Date().toISOString(),
  };

  const response1 = await Hasura(getPrivateMessages, variables);
  const messageDocs = response1.result.data.private_messages;

  const decryptedMessages = [];

  for (let i = 0; i < messageDocs.length; i++) {
    const encryptedMessage = messageDocs[i].encrypted_message;

    const decryptedMessage = await decryptMessage(encryptedMessage);

    decryptedMessages.push({
      id: messageDocs[i].id,
      sender: messageDocs[i].sender,
      receiver: messageDocs[i].receiver,
      message: decryptedMessage,
      created_at: messageDocs[i].created_at,
    });
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: decryptedMessages,
  });
});

module.exports = getLatestPrivateMessage;
