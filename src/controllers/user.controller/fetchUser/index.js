const { query: Hasura } = require('../../../utils/hasura');
const cleanUserdoc = require('../../../utils/cleanUserDoc');
const { getUser, getUserById } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const fetchUser = catchAsync(async (req, res) => {
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

  const response = await Hasura(query, variables);

  const responseData = response.result.data;

  if (!responseData || responseData.user.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this cognito sub',
    });
  }

  const cleanedUserDoc = cleanUserdoc(responseData.user[0], responseData.connections[0]);

  return res.json(cleanedUserDoc);
});

module.exports = fetchUser;
