const { body, query } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getLatestMessageSanitizer = [cognito_sub, query('user_id', 'Invalid User ID').exists().toInt(), query('timeStamp', 'Invalid Time Stamp').optional().isDate(new Date().toISOString())];

const getUserMessagesSanitizer = [cognito_sub];

const sendMessageSanitizer = [cognito_sub, body('message', 'Invalid Message').isString().trim().isLength({ min: 1 }), body('user_id', 'Invalid User ID').exists().toInt()];

module.exports = { getLatestMessageSanitizer, getUserMessagesSanitizer, sendMessageSanitizer };
