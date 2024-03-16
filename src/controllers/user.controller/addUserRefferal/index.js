const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { addUserReferral } = require('./queries/mutations');
const { getUserDetails, getRefferralDetails } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const insertUserActivity = require('../../../utils/insertUserActivity');
const notify = require('../../../utils/notify');

const addUserFeedback = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, emailId } = req.body;

  const getRefferralDetailsResponse = await Hasura(getRefferralDetails, {
    cognitoSub: cognito_sub,
    emailId,
  });

  if (!getRefferralDetailsResponse || getRefferralDetailsResponse.result.data.existingReferral.length !== 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'ReferalExists',
      errorMessage: 'A referal for the user already exists',
    });
  }

  if (!getRefferralDetailsResponse || getRefferralDetailsResponse.result.data.userReferred.length !== 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'CyclicalReferral',
      errorMessage: 'Cyclical referrals are not allowed',
    });
  }

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
  if (emailId === checkIfUserExistsResponse.result.data.userWithCognitoSub[0].email_id) {
    return res.status(400).json({
      success: false,
      errorCode: 'SelfReferral',
      errorMessage: 'You cannot refer yourself',
    });
  }

  const referrerId = checkIfUserExistsResponse.result.data.userWithEmail[0].id;
  const userId = checkIfUserExistsResponse.result.data.userWithCognitoSub[0].id;

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
  await notify(31, userId, userId, [referrerId]).catch(console.log);

  return res.json(addUserReferralResponse.result.data.insert_referrals.returning[0]);
});

module.exports = addUserFeedback;
