const { query: Hasura } = require('../../utils/hasura');
const cleanIdeaDoc = require('../../utils/cleanIdeaDoc');
const { getUserIdeasById, getUserIdeasByCognitoSub } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');

const getUserIdeas = catchAsync(async (req, res) => {
  const { user_id } = req.query;

  let query;
  const variables = {
    cognito_sub: req.query.cognito_sub,
  };

  if (user_id) {
    query = getUserIdeasById;
    variables.user_id = user_id;
  } else {
    query = getUserIdeasByCognitoSub;
  }

  const response = await Hasura(query, variables);

  if (!response.success)
    return res.json(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  const cleanedIdeas = response.result.data.idea.map(cleanIdeaDoc);

  res.json(null, cleanedIdeas);
});

module.exports = {
  getUserIdeas,
};
