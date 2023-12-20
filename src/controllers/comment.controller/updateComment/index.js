const { validationResult } = require('express-validator');
const logger = require('../../../config/logger.js');
const { updateProjectComment, updateIdeaComment, updateThoughtComment } = require('./queries/mutations.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');

const handleUpdateComment = async (updateFunction, articleType, commentId, cognitoSub, comment) => {
  const updateFunctionName = `update_${articleType === 'post' ? 'project' : articleType}_${articleType === 'thought' ? 'comments' : 'comment'}`;

  const updateResponse = await Hasura(updateFunction, { id: commentId, cognitoSub, text: comment });

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

const updateComment = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { commentId } = req.params;
  const { comment, cognito_sub, articleType } = req.body;

  logger.info(`Updating comment: commentId=${commentId}, cognito_sub=${cognito_sub}, articleType=${articleType}`);

  if (!commentId || !comment || !cognito_sub || !articleType) {
    return res.status(400).json({
      success: false,
      errorCode: 'INVALID_INPUT',
      errorMessage: 'Invalid input provided',
      data: null,
    });
  }

  let updateResponse;

  switch (articleType) {
    case 'post':
      updateResponse = await handleUpdateComment(updateProjectComment, articleType, commentId, cognito_sub, comment);
      break;
    case 'idea':
      updateResponse = await handleUpdateComment(updateIdeaComment, articleType, commentId, cognito_sub, comment);
      break;
    case 'thought':
      updateResponse = await handleUpdateComment(updateThoughtComment, articleType, commentId, cognito_sub, comment);
      break;
    default:
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_ARTICLE_TYPE',
        errorMessage: 'Invalid article type provided',
        data: null,
      });
  }

  if (updateResponse.success) {
    return res.status(200).json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: updateResponse.data,
    });
  } else {
    return res.status(400).json({
      success: false,
      errorCode: updateResponse.errorCode || 'UPDATE_COMMENT_FAILED',
      errorMessage: updateResponse.errorMessage || 'Failed to update comment',
      data: null,
    });
  }
});

module.exports = updateComment;
