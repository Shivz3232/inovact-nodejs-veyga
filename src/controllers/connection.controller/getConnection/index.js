const { query: Hasura } = require('../../../utils/hasura');
const sortConnections = require('../../../utils/sortConnections');
const { getUserConnections, getPrivateChats } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getConnection = catchAsync(async (req, res) => {
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

  const connections = sortConnections(response1.result.data.connections, response2.result.data.private_messages, user_id);

  // Restore the below logic later
  // const connections = response1.result.data.connections.map((doc) => {
  //   // eslint-disable-next-line prefer-const
  //   let obj = {
  //     status: doc.status,
  //   };

  //   if (doc.user1 === user_id) {
  //     obj.user = doc.userByUser2;
  //   } else {
  //     obj.user = doc.user;
  //   }

  //   return obj;
  // });

  return res.json(connections);
});

module.exports = getConnection;
