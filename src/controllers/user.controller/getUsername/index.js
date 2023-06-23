const { query: Hasura } = require('../../../utils/hasura');
const { getUsernameFromEmail } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const getUsername = catchAsync(async (req, res) => {
  const email = req.query.email;

  const response = await Hasura(getUsernameFromEmail, { email });

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  if (response.result.data.user.length == 0) {
    return res.json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'User not found',
      data: null,
    });
  }

  res.json({
    success: true,
    errorCode: null,
    errorMessage: null,
    data: response.result.data.user[0].user_name,
  });
});

module.exports = getUsername;
