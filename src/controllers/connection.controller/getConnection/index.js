const { query: Hasura } = require('../../../utils/hasura');
const { getUserConnections, getPrivateChats } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getConnection = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;

  const response1 = await Hasura(getUserConnections, { cognito_sub });

  const connections = response1.result.data.connections;

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

  return res.status(200).json(connections);
});

module.exports = getConnection;
