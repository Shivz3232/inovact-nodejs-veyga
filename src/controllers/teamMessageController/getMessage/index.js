const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { checkIfUserInTeam, getTeamMessages } = require('./queries/queries.js');
const { decryptMessage } = require('../../../utils/decryptMessages');

const { query: Hasura } = require('../../../utils/hasura');

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
  const limit = req.query.limit || 10;

  // const response1 = await Hasura(getUserIdFromCognitoSub, { cognito_sub });
  // const user_id = response1.result.data.user[0].id;

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

  const decryptedMessages = [];

  for (let i = 0; i < messageDocs.length; i++) {
    const encryptedMessage = messageDocs[i].message;

    const decryptedMessage = await decryptMessage(encryptedMessage);

    decryptedMessages.push({
      id: messageDocs[i].id,
      sender: messageDocs[i].user_id,
      team_id: messageDocs[i].team_id,
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

module.exports = getMessage;
