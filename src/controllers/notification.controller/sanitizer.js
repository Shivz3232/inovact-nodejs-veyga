const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getNotificationsSanitizer = [cognito_sub];

const markAsReadSanitizer = [cognito_sub, body('ids', 'Invalid IDs').isArray()];

module.exports = { getNotificationsSanitizer, markAsReadSanitizer };
