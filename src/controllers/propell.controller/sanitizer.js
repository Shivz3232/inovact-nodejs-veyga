const { body } = require('express-validator');

const fetchUserSanitizer = [body('email').notEmpty().withMessage('Email is required in the request body')];

module.exports = { fetchUserSanitizer };
