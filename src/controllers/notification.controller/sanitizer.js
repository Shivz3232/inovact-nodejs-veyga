const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();
const pageSize = query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt();
const pageNumber = query('pageNumber').optional().isInt({ min: 1 }).toInt();

const getNotificationsSanitizer = [cognito_sub, pageSize, pageNumber];

const markAsReadSanitizer = [cognito_sub, body('ids', 'Invalid IDs').isArray()];

module.exports = { getNotificationsSanitizer, markAsReadSanitizer };
