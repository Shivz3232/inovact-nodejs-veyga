const { body, query } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const addAOISanitizer = [cognito_sub, body('interests', 'Invalid Area of Interests provided').isArray().isLength({ min: 1 }), body('interests.*', 'Invalid Area of Interests Provided').exists().isString().trim().isLength({ min: 1 })];

const deactivateUserSanitizer = [cognito_sub, body('status').exists().toInt(), body('cause').isString().trim().isLength({ min: 1 })];

const deleteAOISanitizer = [cognito_sub, body('interests', 'Invalid Area of Interests provided').isArray().isLength({ min: 1 }), body('interest_ids.*').exists().toInt()];

const deleteUserSanitizer = [cognito_sub, body('cause').isString().trim().isLength({ min: 1 })];

const fetchUserSanitizer = [cognito_sub, query('id').optional().toInt()];

const getUserPostsSanitizer = [cognito_sub, query('user_id').optional().toInt()];

const getUserTeamsSanitizer = [cognito_sub, query('user_id').optional().toInt()];

const updateUserSanitizer = [cognito_sub];

const createUserSanitizer = [body('email_id', 'Invalid email').isEmail().normalizeEmail()];

module.exports = { addAOISanitizer, deactivateUserSanitizer, deleteAOISanitizer, deleteUserSanitizer, fetchUserSanitizer, getUserPostsSanitizer, getUserTeamsSanitizer, updateUserSanitizer, createUserSanitizer };
