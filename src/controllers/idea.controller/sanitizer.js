const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

// const addIdeaSanitizer = [cognito_sub, body('description', 'Invalid Description').isString().isLength({ min: 1 }), body('title', 'Invalid Title').isString().isLength({ min: 1 }), body('link', 'Invalid URL').isURL().optional(), body('status', 'Invalid Status').isString(), body('looking_for_members', 'invalid value').isBoolean(), body('looking_for_mentors', 'invalid value').isBoolean(), body('roles_required', 'Invalid Roles').isArray(), body('roles_required.*.role_name').isString().isLength({ min: 1 }), body('roles_required.*.skills_required').optional().isArray().isLength({ min: 1 }), body('idea_tags', 'Invalid Tags').isArray().isLength({ min: 1 }), body('idea_tags.*', 'Invalid Tags').isString().isLength({ min: 1 })];
const addIdeaSanitizer = [cognito_sub];

const deleteIdeaSanitizer = [body('id', 'Invalid Idea ID').exists().toInt()];

const getIdeaSanitizer = [cognito_sub];

const updateIdeaSanitizer = [cognito_sub, body('id', 'Invalid Idea ID').exists().toInt()];

const likeIdeaSanitizer = [cognito_sub, query('idea_id', 'Invalid Idea ID').exists().toInt()];

module.exports = { addIdeaSanitizer, deleteIdeaSanitizer, getIdeaSanitizer, updateIdeaSanitizer, likeIdeaSanitizer };
