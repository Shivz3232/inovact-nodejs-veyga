const { query: Hasura } = require('../../../utils/hasura.js');
const { getUserId, getUserPosts } = require('./queries/queries.js');
const cleanPostDoc = require('../../../utils/cleanPostDoc.js');
const catchAsync = require('../../../utils/catchAsync.js');

const getUserPost = catchAsync(async (req, res) => {
  let { user_id } = req.query;

  if (!user_id) {
    // Find user id
    const { cognito_sub } = req.query;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    // If failed to find user return error
    if (!response1.success)
      return res.json(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    user_id = response1.result.data.user[0].id;
  }

  const variables = {
    user_id,
    cognito_sub: req.query.cognito_sub,
  };

  const response1 = await Hasura(getUserPosts, variables);

  if (!response1.success) return res.json(null, response1.errors);

  const cleanedPosts = response1.result.data.project.map(cleanPostDoc);

  res.json(null, cleanedPosts);
});

module.exports = {
  getUserPost,
};
