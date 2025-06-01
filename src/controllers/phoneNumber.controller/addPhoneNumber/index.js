const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const generateOtp = require('../../../utils/generateOtp');
const { addPhoneNumberMutation, deleteExistingTokensMutation } = require('./queries/mutations');
const { getUserId } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const addPhoneNumber = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: req.body.cognito_sub },
  });

  await Hasura(deleteExistingTokensMutation, { user_id: response1.result.data.user[0].id });

  const token = generateOtp(6);

  const variables = {
    user_id: response1.result.data.user[0].id,
    token,
    expires_at: new Date(new Date().getTime() + 5 * 60000).toISOString,
  };

  await Hasura(addPhoneNumberMutation, variables);

  // @TODO SEND OTP

  return res.json({
    success: true,
  });
});

module.exports = addPhoneNumber;
