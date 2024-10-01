const { validationResult } = require('express-validator');
const catchAsync = require('../../../../utils/catchAsync');
const { query: Hasura } = require('../../../../utils/hasura');
const { delete_thought, getUserId, getThoughtUserId } = require('./queries/queries');
const insertUserActivity = require('../../../../utils/insertUserActivity');

const deleteThought = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  // Find user id
  const { cognito_sub } = req.body;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  const id = req.body.thought_id;
  const variable = {
    id,
  };

  const response2 = await Hasura(getThoughtUserId, variable);

  // check current user
  if (response2.result.data.thoughts[0].user_id !== response1.result.data.user[0].id) {
    return res.status(401).json({
      success: false,
      errorCode: 'UnauthorizedUserException',
      errorMessage: 'Only the owner the thought can delete it.',
      data: null,
    });
  }

  const variables = {
    id,
  };
  await Hasura(delete_thought, variables);

  insertUserActivity('uploading-thoughts', 'negative', response1.result.data.user[0].id, [id]);

  return res.status(200).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteThought;
