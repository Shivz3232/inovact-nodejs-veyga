const { validationResult } = require('express-validator');
const { markNotificationAsRead } = require('./queries/mutations');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const markAsRead = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

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
});

module.exports = markAsRead;
