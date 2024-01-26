const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserFeedbackQuery } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserFeedback = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id } = req.body;

  const getUserFeedbackResponse = await Hasura(getUserFeedbackQuery, {
    id,
  });

  const getUserFeedbackResponseData = getUserFeedbackResponse.result.data;

  if (!getUserFeedbackResponseData || getUserFeedbackResponseData.user_feedback.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this user id',
    });
  }

  return res.json(getUserFeedbackResponseData.user_feedback[0]);
});

module.exports = getUserFeedback;
