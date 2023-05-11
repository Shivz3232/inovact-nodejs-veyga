const { add_likeIdea, delete_like } = require('./queries/mutations');
const { getUserId, getideaId } = require('./queries/queries');
const notify = require('../../../utils/notify');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const likeIdea = catchAsync(async (req, res) => {
  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find logged in user',
    });

  const variable = {
    user_id: response1.result.data.user[0].id,
    idea_id: req.body.idea_id,
  };
  const response = await Hasura(getideaId, variable);

  if (!response.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find idea',
    });

  if (response.result.data.idea_like.length == 0) {
    const response2 = await Hasura(add_likeIdea, variable);

    // If failed to insert project return error
    if (!response2.success)
      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to like the Idea',
      });

    // Notify the user
    await notify(6, req.body.idea_id, response1.result.data.user[0].id, [response.result.data.idea[0].user_id]).catch(
      console.log
    );

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: 'Added a like',
    });
  } else {
    const response3 = await Hasura(delete_like, variable);

    if (!response3.success)
      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to unlike the Idea',
      });

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: 'Removed a like',
    });
  }
});

module.exports = likeIdea;