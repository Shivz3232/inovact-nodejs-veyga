const { body, oneOf } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getTutorialStatusSanitizer = [cognito_sub];
const updateTutorialStatusSanitizer = [cognito_sub, oneOf([body('feed_tutorial').exists().isBoolean(), body('profile_tutorial').exists().isBoolean(), body('team_tutorial').exists().isBoolean()])];

module.exports = { getTutorialStatusSanitizer, updateTutorialStatusSanitizer };
