const { body, query } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const fetchUserSanitizer = [cognito_sub, query('id').optional().toInt()];

module.exports = {
  fetchUserSanitizer,
};
