const { body, query } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getThoughtsSanitizer = [cognito_sub, query('id', 'Invalid Thought ID').optional().toInt()];

module.exports = { getThoughtsSanitizer };
