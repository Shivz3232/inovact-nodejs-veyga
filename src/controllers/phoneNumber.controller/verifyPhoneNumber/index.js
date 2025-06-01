const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const {
  deleteExistingTokensMutation,
  updateUserPhoneNumberMutation,
} = require('./queries/mutations');
const { getToken } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const addPhoneNumber = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const response1 = await Hasura(getToken, {
    cognito_sub: req.body.cognito_sub,
    token: req.body.verification_token,
    now: new Date().toISOString,
  });

  if (response1.result.data.phone_number_verification_token.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'BadRequest',
      errorMessage: 'Missing, invalid or expired OTP',
    });
  }

  await Hasura(updateUserPhoneNumberMutation, {
    cognito_sub: req.body.cognito_sub,
    phone_number: response1.result.data.phone_number_verification_tokens[0].phone_number,
  });

  await Hasura(deleteExistingTokensMutation, { user_id: response1.result.data.user[0].id });

  return res.json({
    success: true,
  });
});

module.exports = addPhoneNumber;
