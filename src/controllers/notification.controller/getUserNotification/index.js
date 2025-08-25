const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getNotifications } = require('./queries/queries');
const cleanNotificationDoc = require('../../../utils/cleanNotificationDoc');
const catchAsync = require('../../../utils/catchAsync');

const getUserNotification = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const pageSize = parseInt(req.query.pageSize, 10) || 20;
  const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
  const offset = (pageNumber - 1) * pageSize;

  const response = await Hasura(getNotifications, { cognito_sub, limit: pageSize, offset });

  const totalItems = response.result.data.notification_aggregate.aggregate.count;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (pageNumber > totalPages) {
    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: [],
      pagination: {
        page: pageNumber,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: false,
        hasPreviousPage: totalPages > 0,
      },
    });
  }

  const notifications = response.result.data.notification.map(
    require('../../../utils/cleanNotificationDoc')
  );

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: notifications,
    pagination: {
      page: pageNumber,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
  });
});

module.exports = getUserNotification;
