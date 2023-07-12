const { markNotificationAsRead } = require('./queries/mutations');

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

  return;
});

module.exports = markAsRead;
