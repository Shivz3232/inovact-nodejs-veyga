const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { updateTutorialStatusQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const getTutorialStatus = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, tutorialComplete } = req.body;

  const response = await Hasura(updateTutorialStatusQuery, {
    cognitoSub: cognito_sub,
    tutorialComplete,
  });

  const responseData = response.result.data.update_user_actions.returning;

  if (!responseData || responseData.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this cognito sub',
    });
  }

  return res.json(responseData[0]);
});

module.exports = getTutorialStatus;
