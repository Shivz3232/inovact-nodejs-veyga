const { query } = require('express-validator');

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt(),

  query('cursor').optional().isISO8601().withMessage('Cursor must be a valid ISO 8601 date'),

  query('sort_by')
    .optional()
    .isIn(['created_at', 'updated_at', 'id', 'title'])
    .withMessage('Sort by must be one of: created_at, updated_at, id, title'),

  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
    .toLowerCase(),
];

const singleItemValidation = [
  query('id').optional().isInt({ min: 1 }).withMessage('ID must be a positive integer').toInt(),
];

module.exports = {
  paginationValidation,
  singleItemValidation,
};
