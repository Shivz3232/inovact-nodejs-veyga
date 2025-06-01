const { query, body, param } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const getJobsSanitizer = [
  cognito_sub,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1-100')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive number')
    .toInt(),
  query('job_type')
    .optional()
    .isString()
    .trim()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
  query('location').optional().isString().trim(),
];

const getJobByIdSanitizer = [
  cognito_sub,
  param('jobId').isInt().withMessage('Valid job ID is required').toInt(),
];

const applyForJobSanitizer = [
  cognito_sub,
  param('jobId').isInt().withMessage('Job ID must be an integer').toInt(),
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('resume_link').optional().isURL().withMessage('Resume link must be a valid URL').trim(),
  body('cover_letter').optional().isString().trim(),
];

module.exports = {
  getJobsSanitizer,
  getJobByIdSanitizer,
  applyForJobSanitizer,
};
