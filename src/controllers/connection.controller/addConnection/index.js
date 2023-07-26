const { query: Hasura } = require('../../../utils/hasura');
const { getUserId, checkValidRequest } = require('./queries/queries');
const { addConnection: addConnectionQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const notify = require('../../../utils/notify');

const addConnection = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const user_id = req.query.user_id;

  // Find user id
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // Check if request is possible
  // 1. Check if user exists
  // 2. Check if user is already requested
  const variables = {
    user1: response1.result.data.user[0].id,
    user2: user_id,
  };

  const response2 = await Hasura(checkValidRequest, variables);

  // 1. Check if user is already requested
  if (response2.result.data.connections.length)
    return res.status(400).json({
      success: false,
      errorCode: 'ConnectionExistsError',
      errorMessage: 'Cannot connect to a person you are already connected with',
      data: null,
    });

  // Add the connection
  const response3 = await Hasura(addConnectionQuery, variables);

  // Notify the user
  console.log(response3.result.data.insert_connections.returning);
  console.log(response1.result.data);
  console.log(user_id);
  await notify(16, response3.result.data.insert_connections.returning[0].id, response1.result.data.user[0].id, [user_id]).catch(console.log);

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addConnection;
