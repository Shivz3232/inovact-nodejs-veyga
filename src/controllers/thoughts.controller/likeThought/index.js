const { validationResult } = require('express-validator');
const { add_likeThought, delete_like } = require('./queries/mutations');
const { getUserId, getThoughtId } = require('./queries/queries');
const notify = require('../../../utils/notify');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');

const likeThought = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }
  // Find user id
  const { cognito_sub } = req.body;
  const { thought_id } = req.query;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  const variable = {
    user_id: response1.result.data.user[0].id,
    thought_id,
  };
  const response = await Hasura(getThoughtId, variable);

  if (response.result.data.thought_likes.length == 0) {
    const response2 = await Hasura(add_likeThought, variable);

    // Notify the user
    await notify(11, thought_id, response1.result.data.user[0].id, [response.result.data.thoughts[0].user_id]).catch(console.log);

    return res.status(201).json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: 'Added a like',
    });
  }
  const response3 = await Hasura(delete_like, variable);

  return res.status(204).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: 'Removed a like',
  });
});

module.exports = likeThought;
