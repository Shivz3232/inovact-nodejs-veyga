const logger = require('../../../config/logger.js');
const { getUserId } = require('./queries/queries.js');
const { updateProjectComment, updateIdeaComment, updateThoughtComment } = require('./queries/mutations.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');

const handleUpdateComment = async (updateFunction, articleType, commentId, userId, comment) => {
  const updateResponse = await Hasura(updateFunction, { id: commentId, userId, text: comment });
  const updateFunctionName = `update_${articleType === 'post' ? 'project' : articleType}_${articleType === 'thought' ? 'comments' : 'comment'}`;
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
    data: updateResponse.result.data[updateFunctionName].returning[0],
  };
};

const removeComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { comment, cognito_sub, articleType } = req.body;

  const getUserIdResponse = await Hasura(getUserId, { cognito_sub: { _eq: cognito_sub } });
  const userId = getUserIdResponse.result.data.user[0].id;

  let updateResponse;

  switch (articleType) {
    case 'post':
      updateResponse = await handleUpdateComment(updateProjectComment, articleType, commentId, userId, comment);
      break;
    case 'idea':
      updateResponse = await handleUpdateComment(updateIdeaComment, articleType, commentId, userId, comment);
      break;
    case 'thought':
      updateResponse = await handleUpdateComment(updateThoughtComment, articleType, commentId, userId, comment);
      break;
    default:
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_ARTICLE_TYPE',
        errorMessage: 'Invalid article type provided',
        data: null,
      });
  }

  return res.status(updateResponse.success ? 200 : 400).json(updateResponse);
});

module.exports = removeComment;
