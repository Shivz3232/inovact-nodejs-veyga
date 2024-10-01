const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getIdeaSanitizer = [cognito_sub, query('id', 'Invalid Idea ID').optional().toInt()];

module.exports = { getIdeaSanitizer };
