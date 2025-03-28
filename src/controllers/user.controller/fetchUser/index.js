const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const cleanUserdoc = require('../../../utils/cleanUserDoc');
const { getUser, getUserById, checkIfUserHasBlocked } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

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
    const usersToExcludeResponse = await Hasura(checkIfUserHasBlocked, { userId: id });
    if (usersToExcludeResponse.result.data.user_blocked_users.length !== 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'UserNotFound',
        errorMessage: 'No user found',
      });
    }

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
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this cognito sub',
    });
  }

  const cleanedUserDoc = cleanUserdoc(responseData.user[0], responseData.connections[0], {
    connectionsCount: responseData.connections_aggregate.aggregate.count,
    teamsCount: responseData.team_members_aggregate.aggregate.count,
  });

  return res.json(cleanedUserDoc);
});

module.exports = fetchUser;
