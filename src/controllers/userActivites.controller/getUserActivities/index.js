const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserActivitiesQuery } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserActivities = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const getUserActivitiesQueryResponse = await Hasura(getUserActivitiesQuery, {
    cognitoSub: cognito_sub,
  });

  const responseData = getUserActivitiesQueryResponse.result.data.user_activities;

  if (!responseData || responseData.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'ActivitiesNotFound',
      errorMessage: 'No activities found with this cognito sub',
    });
  }

  return res.json(responseData);
});

module.exports = getUserActivities;
