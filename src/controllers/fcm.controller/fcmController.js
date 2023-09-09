const catchAsync = require('../../utils/catchAsync');
const { getUserId, UpdateUserFCMToken } = require('./queries/queries');
const { query: Hasura } = require('../../utils/hasura');

const sendNotification = catchAsync(async (req, res) => {
  const { fcm_token, cognito_sub } = req.body;

  // Find user id
  const response = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  console.log(response);

  await Hasura(UpdateUserFCMToken, {
    userId: response.result.data.user[0].id,
    fcmToken: fcm_token,
  });

  res.status(200).json({
    success: true,
  });
});

module.exports = { sendNotification };
