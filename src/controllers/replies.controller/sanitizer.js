const { body, param } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const allowedArticleTypes = ['post', 'idea', 'thought'];

const replySanitizer = [
  cognito_sub,
  body('text', 'Invalid Text').isString().isLength({ min: 1, max: 5000 }),
  param('commentId', 'Invalid comment ID').exists().isInt(),
  body('commentType').exists().isIn(allowedArticleTypes).withMessage('Invalid parent type'),
];

const updateReplySanitizer = [
  cognito_sub,
  param('replyId', 'Invalid reply ID').exists().isInt(),
  body('text', 'Invalid Text').isString().isLength({ min: 1, max: 5000 }),
  body('commentType').exists().isIn(allowedArticleTypes).withMessage('Invalid parent type'),
];

const removeReplySanitizer = [
  cognito_sub,
  param('replyId', 'Invalid reply ID').exists().isInt(),
  body('commentType').exists().isIn(allowedArticleTypes).withMessage('Invalid parent type'),
];

module.exports = { replySanitizer, updateReplySanitizer, removeReplySanitizer };
