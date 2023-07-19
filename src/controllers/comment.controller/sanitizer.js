const { body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const commentSanitizer = [cognito_sub, body('text', 'Invalid Text').isString().isLength({ min: 1, max: 100 }), body('article_id').exists().toInt(), body('article_type').isString()];

module.exports = { commentSanitizer };
