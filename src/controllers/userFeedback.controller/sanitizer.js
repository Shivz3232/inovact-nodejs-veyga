const { body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const addUserFeedbackSanitizer = [cognito_sub, body('userId', 'User ID Not Provided').exists().isInt(), body('subject', 'Subject Not Provided').exists().isString(), body('body', 'Body Not Provided').exists().isString()];
const getUserFeedbackSanitizer = [cognito_sub, body('id', 'User ID Not Provided').exists().isInt()];

module.exports = { addUserFeedbackSanitizer, getUserFeedbackSanitizer };
