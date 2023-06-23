const { markNotificationAsRead } = require('./queries/mutations');
const logger = require('../../../config/logger');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const markAsRead = catchAsync(async (req, res) => {
  res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });

  const { cognito_sub, ids } = req.body;

  const variables = {
    cognito_sub,
    ids,
  };

  const response = await Hasura(markNotificationAsRead, variables);

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  return;
});

module.exports = markAsRead;
