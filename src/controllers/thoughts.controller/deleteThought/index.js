const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const {
  delete_thought,
  getUserId,
  getThoughtUserId,
} = require('./queries/queries');

const deleteThought = catchAsync(async (req, res) => {
  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
      data: null,
    });

  const id = await req.body.id;
  const variable = {
    id,
  };

  const response2 = await Hasura(getThoughtUserId, variable);

  if (!response2.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find thought',
      data: null,
    });

  //check current user
  if (response2.result.data.thoughts[0].user_id != response1.result.data.user[0].id) {
    return res.json({
      success: false,
      errorCode: 'UnauthorizedUserException',
      errorMessage: 'Only the owner the thought can delete it.',
      data: null,
    });
  }
  const variables = {
    id,
  };
  const response = await Hasura(delete_thought, variables);

  if (response.success) {
    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: null,
    });
  }

  return res.json({
    success: false,
    errorCode: 'InternalServerError',
    errorMessage: 'Failed to delete thought',
    data: null,
  });


});

module.exports = deleteThought
