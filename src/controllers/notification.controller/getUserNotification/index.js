const { query: Hasura } = require('../../../utils/hasura');
const { getNotifications } = require('./queries/queries');
const cleanNotificationDoc = require('../../../utils/cleanNotificationDoc');
const catchAsync = require('../../../utils/catchAsync');

const getUserNotification = catchAsync(async (req,res)=>{
  const { cognito_sub } = req.body;

  const response = await Hasura(getNotifications, { cognito_sub });

  if (!response.success) {
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch notifications',
      data: null,
    });
  }

  const notifications =
    response.result.data.notification.map(cleanNotificationDoc);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: notifications,
  });
});

module.exports = getUserNotification
