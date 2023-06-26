const { query: Hasura } = require('../../../utils/hasura');
const { getUserId, getUserPosts } = require('./queries/queries');
const cleanPostDoc = require('../../../utils/cleanPostDoc');
const catchAsync = require('../../../utils/catchAsync');

const getUserProject = catchAsync(async (req, res) => {
  let { user_id } = req.query;
  const { cognito_sub } = req.body;

  if (!user_id) {
    // Find user id
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    user_id = response1.result.data.user[0].id;
  }

  const variables = {
    user_id,
    cognito_sub: req.body.cognito_sub,
  };

  const response1 = await Hasura(getUserPosts, variables);

  const cleanedPosts = response1.result.data.project.map(cleanPostDoc);

  return res.json(cleanedPosts);
});

module.exports = getUserProject;
