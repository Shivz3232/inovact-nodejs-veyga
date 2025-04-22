const { body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const addPhoneNumberSanitizer = [
  cognito_sub,
  body('phone_number').isString().isMobilePhone('en-IN').withMessage('Invalid phone number'),
];

const verifyPhoneNumberSanitizer = [
  cognito_sub,
  body('verification_token').isString().isNumeric().isLength(6),
];

module.exports = {
  addPhoneNumberSanitizer,
  verifyPhoneNumberSanitizer,
};
