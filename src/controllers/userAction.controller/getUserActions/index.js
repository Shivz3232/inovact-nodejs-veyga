const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserActionDetails } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserActions = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const response = await Hasura(getUserActionDetails, {
    cognitoSub: cognito_sub,
  });

  const responseData = response.result.data;

  if (!responseData || responseData.user_actions.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this cognito sub',
    });
  }

  return res.json(responseData.user_actions[0]);
});

module.exports = getUserActions;
