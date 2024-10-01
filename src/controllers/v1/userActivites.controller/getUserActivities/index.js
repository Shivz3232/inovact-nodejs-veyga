const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { getUserActivitiesQuery } = require('./queries/queries');
const constructActivityResponse = require('../../../../utils/constructActivityResponse');
const catchAsync = require('../../../../utils/catchAsync');

const getUserActivities = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'ValidationError',
      errorMessage: 'Invalid input. Please check the provided data.',
      errors: sanitizerErrors.array(),
    });
  }

  const { cognito_sub } = req.body;

  const getUserActivitiesQueryResponse = await Hasura(getUserActivitiesQuery, {
    cognitoSub: cognito_sub,
  });

  const userActivities = getUserActivitiesQueryResponse.result.data.user_activities;

  const cleanedResponseData = await constructActivityResponse(userActivities);

  return res.json({
    success: true,
    data: cleanedResponseData,
  });
});

module.exports = getUserActivities;
