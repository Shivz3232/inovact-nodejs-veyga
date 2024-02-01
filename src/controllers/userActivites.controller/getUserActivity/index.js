const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserActivityQuery } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserPoints = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { activityId } = req.params;

  const getUserActivityQueryResponse = await Hasura(getUserActivityQuery, {
    activityId,
  });

  const responseData = getUserActivityQueryResponse.result.data.user_activities;

  if (!responseData || responseData.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No activity found with this id',
    });
  }

  return res.json(responseData[0]);
});

module.exports = getUserPoints;
