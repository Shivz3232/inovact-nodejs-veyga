const { body, oneOf } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getUserActionsSanitizer = [cognito_sub];
const updateUserActionSanitizer = [cognito_sub, oneOf([body('team_tutorial_complete').optional().isBoolean(), body('feed_tutorial_complete').optional().isBoolean(), body('profile_tutorial_complete').optional().isBoolean(), body('has_uploaded_project').optional().isBoolean(), body('has_uploaded_idea').optional().isBoolean(), body('has_uploaded_thought').optional().isBoolean(), body('has_sought_team').optional().isBoolean(), body('has_sought_mentor').optional().isBoolean(), body('has_sought_team_and_mentor').optional().isBoolean(), body('last_app_opened_timestamp').optional()], 'At least one field is required')];

const blockUserSanitizer = [
  body('cognito_sub').isString().notEmpty(),
  body('user_id').isInt().notEmpty(),
  body('reason').optional().isString()
];

const unblockUserSanitizer = [
  body('cognito_sub').isString().notEmpty(),
  body('user_id').isInt().notEmpty()
];

module.exports = { getUserActionsSanitizer, updateUserActionSanitizer, reportUserSanitizer };
