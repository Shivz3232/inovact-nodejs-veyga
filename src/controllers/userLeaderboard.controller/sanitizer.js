const { body, query } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const pageSize = query('pageSize')
  .optional()
  .isInt({ min: 1, max: 2000 })
  .toInt()
  .withMessage('Page size must be an integer between 1 and 100');

const pageNumber = query('pageNumber')
  .optional()
  .isInt({ min: 1 })
  .toInt()
  .withMessage('Page number must be a positive integer');

const getUserLeaderboardSanitizer = [cognito_sub, pageSize, pageNumber];

module.exports = { getUserLeaderboardSanitizer };
