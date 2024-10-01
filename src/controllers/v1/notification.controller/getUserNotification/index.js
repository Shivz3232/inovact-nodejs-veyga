const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { getNotifications } = require('./queries/queries');
const cleanNotificationDoc = require('../../../../utils/cleanNotificationDoc');
const catchAsync = require('../../../../utils/catchAsync');

const getUserNotification = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const response = await Hasura(getNotifications, { cognito_sub });

  const notifications = response.result.data.notification.map(cleanNotificationDoc);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: notifications,
  });
});

module.exports = getUserNotification;
