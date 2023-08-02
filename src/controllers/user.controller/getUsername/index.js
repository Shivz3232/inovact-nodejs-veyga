const { query: Hasura } = require('../../../utils/hasura');
const { getUsernameFromEmail } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const { validationResult } = require('express-validator');

const getUsername = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { email } = req.query;

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
