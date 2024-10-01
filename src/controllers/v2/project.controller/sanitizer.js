const { query, body, oneOf } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getProjectSanitizer = [cognito_sub, query('id', 'Invalid Project ID').optional().toInt()];

module.exports = {
  getProjectSanitizer,
};
