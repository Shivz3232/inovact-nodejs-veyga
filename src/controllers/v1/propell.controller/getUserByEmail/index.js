const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { getUserFromEmail } = require('./queries');
const catchAsync = require('../../../../utils/catchAsync');

const fetchUserFromEmail = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { email: email_id } = req.body;

  const variables = {
    email_id,
  };

  const response = await Hasura(getUserFromEmail, variables);

  const responseData = response.result.data;

  if (!responseData || responseData.user.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this email address.',
    });
  }

  return res.end();
});

module.exports = fetchUserFromEmail;
