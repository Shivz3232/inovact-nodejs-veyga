const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const cleanUserdoc = require('../../../utils/cleanUserDoc');
const { getUser, getUserById } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_INTERVAL_MS = 3000;

const fetchUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id } = req.query;
  const { cognito_sub } = req.body;

  let query;
  let variables;

  if (id) {
    query = getUserById;

    variables = {
      id,
      cognito_sub,
    };
  } else {
    query = getUser;

    variables = {
      cognito_sub,
    };
  }
  
  let userFound = false;
  let userData = null;
  let retryCount = 0;

  const response = await Hasura(query, variables);
  const responseData = response.result.data;

  if (responseData || responseData.user.length > 0) {
    userData = cleanUserdoc(responseData.user[0], responseData.connections[0]);
    userFound = true;
  } else {
    while (retryCount < MAX_RETRY_ATTEMPTS && !userFound) {
      const response = await Hasura(query, variables);

      const responseData = response.result.data;

      if (responseData && responseData.user.length > 0) {
        userData = cleanUserdoc(responseData.user[0], responseData.connections[0]);
        userFound = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
        retryCount++;
      }
    }
  }

  if (!userFound) {
    return res.status(400).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'User data not available after retrying.',
    });
  }

  return res.json(userData);
});

module.exports = fetchUser;
