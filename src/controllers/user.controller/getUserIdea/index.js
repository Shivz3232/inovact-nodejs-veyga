const { query: Hasura } = require('../../../utils/hasura');
const cleanIdeaDoc = require('../../../utils/cleanIdeaDoc');
const { getUserIdeasById, getUserIdeasByCognitoSub } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserIdea = catchAsync(async (req, res) => {
  let user_id = req.query.user_id;
  let query;
  let variables = {
    cognito_sub: req.body.cognito_sub,
  };

  if (user_id) {
    query = getUserIdeasById;
    variables.user_id = user_id;
  } else {
    query = getUserIdeasByCognitoSub;
  }

  const response = await Hasura(query, variables);

  const cleanedIdeas = response.result.data.idea.map(cleanIdeaDoc);

  res.status(200).json(cleanedIdeas);
});

module.exports = getUserIdea;
