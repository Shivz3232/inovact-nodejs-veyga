const { body, param, oneOf } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getUserActivitySanitizer = [cognito_sub, [param('activityId', 'Invalid activityId').exists().isUUID()]];
const getUserActivitiesSanitizer = [cognito_sub];
const insertUserActivitySanitizer = [cognito_sub, body('activityIdentifier', 'Invalid activity Identifier').exists().isString(), body('direction', 'Invalid direction').exists().isIn(['positive', 'negative']), body('entityId', 'Invalid entityId').isInt().exists()];

module.exports = { getUserActivitySanitizer, getUserActivitiesSanitizer, insertUserActivitySanitizer };
