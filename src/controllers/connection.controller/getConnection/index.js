const { query: Hasura } = require('../../../utils/hasura');
const { getUserConnections, getUserId } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getConnection = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;

  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });

  const user_id = parseInt(response1.result.data.user[0].id, 10);

  const variables = {
    user_id,
  };

  const response2 = await Hasura(getUserConnections, variables);

  if (!response2.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  const connections = response2.result.data.connections.map((doc) => {
    // eslint-disable-next-line prefer-const
    let obj = {
      status: doc.status,
    };

    if (doc.user1 === user_id) {
      obj.user = doc.userByUser2;
    } else {
      obj.user = doc.user;
    }

    return obj;
  });

  return res.json(connections);
});

module.exports = getConnection;
