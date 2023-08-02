const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const connectionsSanitizer = [cognito_sub, query('user_id', 'Invalid User ID').exists().toInt()];

const getConnectionSanitizer = [cognito_sub];

const getNetStatSanitizer = [cognito_sub];

module.exports = { connectionsSanitizer, getConnectionSanitizer, getNetStatSanitizer };
