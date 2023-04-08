const { query: Hasura } = require('../../../utils/hasura');
const { getUserId } = require('./queries/queries');
const { removeConnection : removeConnectionQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const removeConnection = catchAsync(async (req,res)=>{
  const user_id = req.body.user_id;

  // Find user id
  const cognito_sub = req.body.cognito_sub;
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

  // Fetch connection
  const variables = {
    user2: response1.result.data.user[0].id,
    user1: user_id,
  };
  console.log(variables)

  const response2 = await Hasura(removeConnectionQuery, variables);

  console.log(response2.result.data.delete_connections)

  if (!response2.success)
    res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});
module.exports = removeConnection

