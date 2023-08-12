const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

// const addProjectSanitizer = [cognito_sub, body('description', 'Invalid Description').isString().trim().isLength({ min: 1 }), body('title', 'Invalid Title').isString().trim().isLength({ min: 1 }), body('link', 'Invalid URL').isURL().optional(), body('status', 'Invalid Status').isString(), body('looking_for_members', 'invalid value').isBoolean(), body('looking_for_mentors', 'invalid value').isBoolean(), body('roles_required', 'Invalid Roles').optional().isArray(), body('roles_required.*.role_name').isString().isLength({ min: 1 }), body('roles_required.*.skills_required').isArray().isLength({ min: 1 }), body('project_tags', 'Invalid Tags').isArray().isLength({ min: 1 }), body('project_tags.*', 'Invalid Tags').isString().isLength({ min: 1 }), body('documents').isArray().optional(), body('completed').isBoolean(), body('mentions', 'invalid Mentions').optional().isArray()];
const addProjectSanitizer = [cognito_sub];

const deleteProjectSanitizer = [body('id', 'Invalid Project ID').exists().toInt()];

const getProjectSanitizer = [cognito_sub];

const updateProjectSanitizer = [cognito_sub, body('id', 'Invalid Project ID').exists().toInt()];

const likeProjectSanitizer = [cognito_sub, query('project_id', 'Invalid Project ID').exists().toInt()];

module.exports = { addProjectSanitizer, deleteProjectSanitizer, getProjectSanitizer, updateProjectSanitizer, likeProjectSanitizer };
