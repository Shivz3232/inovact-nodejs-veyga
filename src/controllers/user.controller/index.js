const catchAsync = require('../../utils/catchAsync');
const { getUser: getUserQuery, getUserById } = require('./queries/queries');
const { query: Hasura } = require('../../utils/hasura');
const cleanUserDoc = require('../../utils/cleanUserDoc');

const getUser = catchAsync(async (req, res) => {
  const { id, cognito_sub } = req.body;

  let query;
  let variables;

  if (id) {
    query = getUserById;

    variables = {
      id,
      cognito_sub,
    };
  } else {
    query = getUserQuery;

    variables = {
      cognito_sub,
    };
  }

  const response = await Hasura(query, variables);

  if (!response.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
    });

  const cleanedUserDoc = cleanUserDoc(response.result.data.user[0], response.result.data.connections[0]);

  res.json(cleanedUserDoc);
});

module.exports = {
  getUser,
};
