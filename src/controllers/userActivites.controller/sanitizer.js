const { body, param, oneOf } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getUserActivitySanitizer = [cognito_sub, [param('activityId', 'Invalid activityId').exists().isUUID()]];
const getUserActivitiesSanitizer = [cognito_sub];
const insertUserActivitySanitizer = [cognito_sub, body('activityId', 'Invalid activityId').exists().isUUID(), body('direction', 'Invalid direction').exists().isIn(['positive', 'negative']), body('status', 'Invalid status').optional().isIn(['processed', 'unprocessed'])];

module.exports = { getUserActivitySanitizer, getUserActivitiesSanitizer, insertUserActivitySanitizer };
