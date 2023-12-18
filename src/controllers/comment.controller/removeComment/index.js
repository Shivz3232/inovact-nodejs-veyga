const logger = require('../../../config/logger.js');
const { getUserId } = require('./queries/queries.js');
const { removeProjectComment, removeIdeaComment, removeThoughtComment } = require('./queries/mutations.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');

const handleRemoveComment = async (updateFunction, articleType, commentId, userId, comment) => {
  const updateResponse = await Hasura(updateFunction, { id: commentId, userId, text: comment });
  if (!updateResponse.success) {
    return {
      success: false,
      errorCode: updateResponse.errorCode,
      errorMessage: updateResponse.errorMessage,
      data: null,
    };
  }

  return {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  };
};

const removeComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { cognito_sub, articleType } = req.body;

  const getUserIdResponse = await Hasura(getUserId, { cognito_sub: { _eq: cognito_sub } });
  const userId = getUserIdResponse.result.data.user[0].id;

  let removeResponse;

  switch (articleType) {
    case 'post':
      removeResponse = await handleRemoveComment(removeProjectComment, articleType, commentId, userId);
      break;
    case 'idea':
      removeResponse = await handleRemoveComment(removeIdeaComment, articleType, commentId, userId);
      break;
    case 'thought':
      removeResponse = await handleRemoveComment(removeThoughtComment, articleType, commentId, userId);
      break;
    default:
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_ARTICLE_TYPE',
        errorMessage: 'Invalid article type provided',
        data: null,
      });
  }

  return res.status(removeResponse.success ? 200 : 400).json(removeResponse);
});

module.exports = removeComment;