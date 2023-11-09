const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { checkIfCanDelete, getUserIdFromCognitoSub, GetTeamMessages } = require('./queries/queries.js');
const { decryptMessages } = require('../../../utils/decryptMessages');

const { query: Hasura } = require('../../../utils/hasura');

const getMessage = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }
  const { cognito_sub, team_id } = req.body;
  const { timeStamp } = req.query;

  const response1 = await Hasura(getUserIdFromCognitoSub, { cognito_sub });
  const user_id = response1.result.data.user[0].id;

  const variables = { team_id, user_id, cognito_sub };

  const response2 = await Hasura(checkIfCanDelete, variables);

  if (response1.result.data.members.length === 0) {
    return res.status(400).json(errorResponse('Forbidden', 'Given user is not a member of this team.'));
  }

  const variables3 = {
    team_id,
    timeStamp: timeStamp || new Date().toISOString(),
  };

  const response3 = await Hasura(GetTeamMessages, variables3);

  const decryptedMessages = await decryptMessages(response3.result.data.team_messages);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: decryptedMessages,
  });
});

module.exports = getMessage;
