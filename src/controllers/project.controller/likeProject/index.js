const { add_likePost, delete_like } = require('./queries/mutations');
const { getUserId, getPostId } = require('./queries/queries');
const notify = require('../../../utils/notify');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const likeProject = catchAsync(async (req, res) => {
  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const project_id = req.query.project_id;

  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  const variable = {
    user_id: response1.result.data.user[0].id,
    project_id,
  };

  const response = await Hasura(getPostId, variable);

  if (response.result.data.project_like.length == 0) {
    const response2 = await Hasura(add_likePost, variable);

    // Notify the user
    await notify(1, project_id, response1.result.data.user[0].id, [response.result.data.project[0].user_id]).catch(console.log);

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: 'Added a like',
    });
  } else {
    const response3 = await Hasura(delete_like, variable);

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: 'Removed a like',
    });
  }
});

module.exports = likeProject;
