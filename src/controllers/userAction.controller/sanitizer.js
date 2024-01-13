const { body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getTutorialStatusSanitizer = [cognito_sub];
const updateTutorialStatusSanitizer = [cognito_sub, body('tutorialComplete', 'Tutorial Status Not Provided').exists().isBoolean()];

module.exports = { getTutorialStatusSanitizer, updateTutorialStatusSanitizer };
