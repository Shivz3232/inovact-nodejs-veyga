const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { addUserReferral } = require('./queries/mutations');
const { getUserDetails, checkIfReferalExists } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const insertUserActivity = require('../../../utils/insertUserActivity');

const addUserFeedback = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, emailId } = req.body;

  const checkIfUserExistsResponse = await Hasura(getUserDetails, {
    emailId,
    cognitoSub: cognito_sub,
  });

  if (!checkIfUserExistsResponse || checkIfUserExistsResponse.result.data.userWithEmail.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this email id',
    });
  }

  const referrerId = checkIfUserExistsResponse.result.data.userWithEmail[0].id;
  const userId = checkIfUserExistsResponse.result.data.userWithCognitoSub[0].id;

  const checkIfReferalExistsResponse = await Hasura(checkIfReferalExists, {
    userId,
    referrerId,
  });

  if (!checkIfReferalExistsResponse || checkIfReferalExistsResponse.result.data.referrals.length !== 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'ReferalExists',
      errorMessage: 'A referal with this email id and user already exists',
    });
  }

  const addUserReferralResponse = await Hasura(addUserReferral, {
    userId,
    referrerId,
  });

  if (!addUserReferralResponse || addUserReferralResponse.result.data.insert_referrals.returning.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'ErrorAddingReferal',
      errorMessage: 'Error in adding referal',
    });
  }

  insertUserActivity('referral', 'positive', userId, []);

  return res.json(addUserReferralResponse.result.data.insert_referrals.returning[0]);
});

module.exports = addUserFeedback;
