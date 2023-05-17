const { query: Hasura } = require('../../../utils/hasura');
const cleanUserdoc = require('../../../utils/cleanUserDoc');
const { getUser, getUserById } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const fetchUser = catchAsync(async (req,res)=>{
  const id = req.body.id;
  const cognito_sub = req.body.cognito_sub;

  let query;
  let variables;

  if (id) {
    query = getUserById;

    variables = {
      id: {
        _eq: id,
      },
    };
  } else {
    query = getUser;

    variables = {
      cognito_sub: {
        _eq: cognito_sub,
      },
    };
  }

  const response = await Hasura(query, variables);

  if (!response.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch user data',
    });

    console.log(response.result.data.user[0])
  const cleanedUserDoc = cleanUserdoc(response.result.data.user[0]);

  res.json(cleanedUserDoc);
});

module.exports = fetchUser
