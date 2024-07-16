const { body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getUserLeaderboardSanitizer = [cognito_sub];

module.exports = { getUserLeaderboardSanitizer };
