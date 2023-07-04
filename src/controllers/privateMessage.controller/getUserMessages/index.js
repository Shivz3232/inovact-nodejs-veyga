const { query: Hasura } = require('../../../utils/hasura');
const sortConnections = require('../../../utils/sortConnections');
const { getUserConnections, getPrivateChats } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserMessages = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;

  const response1 = await Hasura(getUserConnections, { cognito_sub });

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });

  const user_id = parseInt(response1.result.data.user[0].id, 10);

  const variables = {
    connection_ids: response1.result.data.connections.map((connection) => connection.id),
  };

  const response2 = await Hasura(getPrivateChats, variables);

  if (!response2.success)
    return res.json({
      sucess: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  const sortedByMessage = response2.result.data.users.sort((a, b) => {
    const aDate = a.private_messages.length ? new Date(a.private_messages[0].created_at) : new Date(0);
    const bDate = b.private_messages.length ? new Date(b.private_messages[0].created_at) : new Date(0);
    return bDate - aDate;
  });

  const connections = sortConnections(response2.result.data.users);

  return res.json(connections);
});

module.exports = getUserMessages;
