const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { addThought } = require('./queries/mutations');
const { getUser, getThought } = require('./queries/queries');

const addThoughts = catchAsync(async (req, res) => {
  // Find user id
  const cognito_sub = req.body.cognito_sub;

  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  const thoughtData = {
    thought: req.body.thought,
    user_id: response1.result.data.user[0].id,
  };

  const response2 = await Hasura(addThought, thoughtData);

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addThoughts;
