const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserIdQuery } = require('./queries/queries');
const insertUserActivity = require('../../../utils/insertUserActivity');
const catchAsync = require('../../../utils/catchAsync');

const getUserPoints = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, activityIdentifier, entityId } = req.body;

  const response = await Hasura(getUserIdQuery, {
    cognitoSub: cognito_sub,
  });

  const getUserIdQueryResponse = response.result.data;

  if (!getUserIdQueryResponse || getUserIdQueryResponse.user.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this cognito sub',
    });
  }

  const userId = getUserIdQueryResponse.user[0].id;

  insertUserActivity(activityIdentifier, 'positive', userId, [entityId]);

  return res.status(200).json({
    success: true,
    data: null,
  });
});

module.exports = getUserPoints;
