const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { addUserFeedbackQuery } = require('./queries/mutations');
const { fetchUserEmailFromUserId } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const addUserFeedback = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { userId, subject, body } = req.body;

  const fetchEmailFromUserIdResponse = await Hasura(fetchUserEmailFromUserId, {
    userId,
  });
  const { email_id } = fetchEmailFromUserIdResponse.result.data.user[0];
  console.log(email_id);

  const addUserFeedbackResponse = await Hasura(addUserFeedbackQuery, {
    userId,
    subject,
    body,
    email_id,
  });


  const addUserFeedbackResponseData = addUserFeedbackResponse.result.data;

  if (!addUserFeedbackResponseData || addUserFeedbackResponseData.insert_user_feedback.returning.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this user id',
    });
  }

  return res.json(addUserFeedbackResponseData.insert_user_feedback.returning[0]);
});

module.exports = addUserFeedback;
