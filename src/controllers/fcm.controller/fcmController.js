const catchAsync = require('../../utils/catchAsync');
const { UpdateUserFCMToken } = require('./queries/mutation');
const { query: Hasura } = require('../../utils/hasura');

const saveToken = catchAsync(async (req, res) => {
  const { fcm_token, cognito_sub } = req.body;

  await Hasura(UpdateUserFCMToken, {
    cognito_sub,
    fcm_token,
  });

  return res.status(200).json({
    success: true,
  });
});

module.exports = { saveToken };
