const { validationResult } = require('express-validator');
const cleanUserdoc = require('../../../utils/cleanUserDoc');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { email, password, confirm_passowrd, university, degree, graduation_year, user_interests, first_name, last_name, bio, avatar } = req.body;

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = {
  createUser,
};
