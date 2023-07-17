const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const addProjectSanitizer = [cognito_sub, body('description', 'Invalid Description').isString(), body('title', 'Invalid Title').isString(), body('link', 'Invalid URL').isURL(), body('status', 'Invalid Status').isString(), body('looking_for_members', 'invalid value').isBoolean(), body('looking_for_mentors', 'invalid value').isBoolean(), body('roles_required', 'Invalid Roles').isArray(), body('roles_required.*.role_name').isString().isLength({ min: 1 }), body('roles_required.*.skills_required').isArray().isLength({ min: 1 }), body('project_tags', 'Invalid Tags').isArray(), body('project_tags.*', 'Invalid Tags').isString().isLength({ min: 1 }), body('documents').isArray(), body('completed').isBoolean(), body('mentions', 'invalid Mentions').isArray()];

const deleteProjectSanitizer = [body('id', 'Invalid Project ID').exists().toInt()];

const getProjectSanitizer = [cognito_sub];

const updateProjectSanitizer = [cognito_sub, body('id', 'Invalid Project ID').exists().toInt()];

const likeProjectSanitizer = [cognito_sub, query('id').exists().toInt()];

module.exports = { addProjectSanitizer, deleteProjectSanitizer, getProjectSanitizer, updateProjectSanitizer, likeProjectSanitizer };
