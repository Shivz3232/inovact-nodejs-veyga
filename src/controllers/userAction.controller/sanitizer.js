const { body, oneOf } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getTutorialStatusSanitizer = [cognito_sub];
const updateTutorialStatusSanitizer = [cognito_sub, oneOf([body('feed_tutorial_complete').exists().isBoolean(), body('profile_tutorial_complete').exists().isBoolean(), body('team_tutorial_complete').exists().isBoolean()])];

module.exports = { getTutorialStatusSanitizer, updateTutorialStatusSanitizer };
