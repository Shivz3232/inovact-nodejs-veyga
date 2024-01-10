const { body, param } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const allowedArticleTypes = ['post', 'idea', 'thought'];

const commentSanitizer = [cognito_sub, body('text', 'Invalid Text').isString().isLength({ min: 1, max: 5000 }), body('article_id').exists().toInt(), body('article_type').exists().isIn(allowedArticleTypes).withMessage('Invalid articleType')];

const updateCommentSanitizer = [cognito_sub, param('commentId', 'Invalid commentId').exists().isInt(), body('comment', 'Invalid Text').isString().isLength({ min: 1, max: 5000 }), body('articleType').exists().isIn(allowedArticleTypes).withMessage('Invalid articleType')];

const removeCommentSanitizer = [cognito_sub, param('commentId', 'Invalid commentId').exists().isInt(), body('articleType').exists().isIn(allowedArticleTypes).withMessage('Invalid articleType')];

module.exports = { commentSanitizer, updateCommentSanitizer, removeCommentSanitizer };
