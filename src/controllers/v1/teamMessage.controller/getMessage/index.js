const { validationResult } = require('express-validator');
const catchAsync = require('../../../../utils/catchAsync');
const { checkIfUserInTeam, getTeamMessages } = require('./queries/queries.js');
const { decryptMessage } = require('../../../../utils/decryptMessage');
const { query: Hasura } = require('../../../../utils/hasura');

const getMessage = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const { team_id, timeStamp } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  const variables = { team_id, cognito_sub };

  const response1 = await Hasura(checkIfUserInTeam, variables);

  if (response1.result.data.members.length === 0) {
    return res.status(400).json(errorResponse('Forbidden', 'Given user is not a member of this team.'));
  }

  const variables2 = {
    team_id,
    timeStamp: timeStamp || new Date().toISOString(),
    limit,
  };

  const response2 = await Hasura(getTeamMessages, variables2);
  const messageDocs = response2.result.data.team_messages;

  const decryptedMessages = await Promise.all(
    messageDocs.map(async (messageDoc) => {
      const encryptedMessage = messageDoc.message;
      const decryptedMessage = await decryptMessage(encryptedMessage);

      return {
        id: messageDoc.id,
        sender: messageDoc.user_id,
        first_name: messageDoc.user.first_name,
        last_name: messageDoc.user.last_name,
        avatar: messageDoc.user.avatar,
        team_id: messageDoc.team_id,
        message: decryptedMessage,
        created_at: messageDoc.created_at,
      };
    })
  );

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: decryptedMessages,
  });
});

module.exports = getMessage;

function errorResponse(errorCode, errorMessage) {
  return {
    success: false,
    errorCode,
    errorMessage,
    data: null,
  };
}
