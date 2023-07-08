const { body, query } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const addThoughtSanitizer = [cognito_sub, body('thought', 'Enter valid thought').exists().isString().trim().isLength({ min: 1 })];

const deleteThoughtSanitizer = [cognito_sub, body('thought_id', 'Invalid Thought ID').exists().toInt()];

const updateThoughtSanitizer = [cognito_sub, body('thought_id', 'Invalid Thought ID').exists().toInt()];

const likeThoughtSanitizer = [cognito_sub, query('thought_id', 'Invalid Thought ID').exists().toInt()];

module.exports = { addThoughtSanitizer, deleteThoughtSanitizer, updateThoughtSanitizer, likeThoughtSanitizer };
