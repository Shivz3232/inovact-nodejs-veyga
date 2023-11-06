const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { createUserQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

function generateRandomUsername() {
  const min = 1000000000;
  const max = 9999999999;
  const randomUsername = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomUsername.toString();
}

const createUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { email_id, cognito_sub } = req.body;

  const user_name = generateRandomUsername();

  const userData = {
    email_id,
    user_name,
    cognito_sub,
  };

  await Hasura(createUserQuery, userData);

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = createUser;