const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserConnections } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserMessages = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const response1 = await Hasura(getUserConnections, { cognito_sub });

  const connectionsSortedByLatestMessage = response1.result.data.connections.sort((a, b) => {
    const aDate = a.private_messages.length ? new Date(a.private_messages[0].created_at) : new Date(0);
    const bDate = b.private_messages.length ? new Date(b.private_messages[0].created_at) : new Date(0);
    return bDate - aDate;
  });

  return res.json(connectionsSortedByLatestMessage);
});

module.exports = getUserMessages;
