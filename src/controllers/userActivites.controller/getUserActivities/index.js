const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserActivitiesQuery } = require('./queries/queries');
const constructActivityResponse = require('../../../utils/constructActivityResponse');
const catchAsync = require('../../../utils/catchAsync');

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

  try {
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

    const cleanedResponseData = await constructActivityResponse(responseData);

    return res.json({
      success: true,
      data: cleanedResponseData,
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return res.status(500).json({
      success: false,
      errorCode: 'InternalError',
      errorMessage: 'Internal server error. Please try again later.',
    });
  }
});

module.exports = getUserActivities;
