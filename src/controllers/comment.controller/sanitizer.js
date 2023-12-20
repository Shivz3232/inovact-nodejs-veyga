const { body, param } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const commentSanitizer = [cognito_sub, body('text', 'Invalid Text').isString().isLength({ min: 1, max: 100 }), body('article_id').exists().toInt(), body('article_type').isString()];

const updateCommentSanitizer = [cognito_sub, param('commentId', 'Invalid commentId').exists().isInt(), body('comment', 'Invalid Text').isString().isLength({ min: 1, max: 100 }), body('articleType', 'Invalid articleType').exists().isString()];

const removeCommentSanitizer = [cognito_sub, param('commentId', 'Invalid commentId').exists().isInt(), body('articleType', 'Invalid articleType').exists().isString()];

module.exports = { commentSanitizer, updateCommentSanitizer, removeCommentSanitizer };
