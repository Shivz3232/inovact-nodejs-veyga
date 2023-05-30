const { query: Hasura } = require('../../../utils/hasura');
const cleanUserdoc = require('../../../utils/cleanUserDoc');
const { getUser, getUserById } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const fetchUser = catchAsync(async (req, res) => {
  const id = req.query.id;
  const cognito_sub = req.body.cognito_sub;

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

  if (!response.success) {
    console.log(response.errors);
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch user data',
    });
  }

  const userData = response.result.data.user[0];
  if (!userData) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch user data',
    });
  }

  const cleanedUserDoc = cleanUserdoc(response.result.data.user[0]);

  res.json(cleanedUserDoc);
});

module.exports = fetchUser;
