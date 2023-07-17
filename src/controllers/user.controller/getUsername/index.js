const { query: Hasura } = require('../../../utils/hasura');
const { getUsernameFromEmail } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUsername = catchAsync(async (req, res) => {
  const email = req.query.email;

  const response = await Hasura(getUsernameFromEmail, { email });

  if (response.result.data.user.length == 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'User not found',
      data: null,
    });
  }

  return res.json({
    success: true,
    errorCode: null,
    errorMessage: null,
    data: response.result.data.user[0].user_name,
  });
});

module.exports = getUsername;
