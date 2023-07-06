const { getPrivateMessages } = require('./queries/queries');
const { decryptMessages } = require('../../../utils/decryptMessages');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const getLatestPrivateMessage = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const { user_id, timeStamp } = req.query;

  const variables = {
    cognito_sub,
    user_id,
    timeStamp: timeStamp || new Date().toISOString(),
  };

  const response1 = await Hasura(getPrivateMessages, variables);

  const decryptedMessages = await decryptMessages(response1.result.data.private_messages);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: decryptedMessages,
  });
});

module.exports = getLatestPrivateMessage;
