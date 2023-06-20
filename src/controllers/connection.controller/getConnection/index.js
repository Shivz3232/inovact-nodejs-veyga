const { query: Hasura } = require('../../../utils/hasura');
const { getUserConnections, getPrivateChats } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const getConnection = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;

  const response1 = await Hasura(getUserConnections, { cognito_sub });

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  const connections = response1.result.data.connections;

  connections.sort((a, b) => b.id - a.id);

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
