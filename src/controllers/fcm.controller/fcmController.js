const catchAsync = require('../../utils/catchAsync');
const { UpdateUserFCMToken } = require('./queries/queries');
const { query: Hasura } = require('../../utils/hasura');

const saveToken = catchAsync(async (req, res) => {
  const { fcm_token, cognito_sub } = req.body;

  await Hasura(UpdateUserFCMToken, {
    cognito_sub,
    fcm_token,
  });

  res.status(200).json({
    success: true,
  });
});

module.exports = { saveToken };
