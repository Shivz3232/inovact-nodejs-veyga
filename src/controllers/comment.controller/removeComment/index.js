const { validationResult } = require('express-validator');
const logger = require('../../../config/logger.js');
const { removeProjectComment, removeIdeaComment, removeThoughtComment } = require('./queries/mutations.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');

const handleRemoveComment = async (removeFunction, commentId, cognitoSub) => {
  const removeCommentResponse = await Hasura(removeFunction, { id: commentId, cognitoSub });

  if (!removeCommentResponse.success) {
    return {
      success: false,
      errorCode: removeCommentResponse.errorCode,
      errorMessage: removeCommentResponse.errorMessage,
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
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { commentId } = req.params;
  const { cognito_sub, articleType } = req.body;

  logger.info(`Removing comment: commentId=${commentId}, cognito_sub=${cognito_sub}, articleType=${articleType}`);

  let removeResponse;

  switch (articleType) {
    case 'post':
      removeResponse = await handleRemoveComment(removeProjectComment, commentId, cognito_sub);
      break;
    case 'idea':
      removeResponse = await handleRemoveComment(removeIdeaComment, commentId, cognito_sub);
      break;
    case 'thought':
      removeResponse = await handleRemoveComment(removeThoughtComment, commentId, cognito_sub);
      break;
    default:
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_ARTICLE_TYPE',
        errorMessage: 'Invalid article type provided',
        data: null,
      });
  }

  if (!removeResponse.success) {
    return res.status(400).json({
      success: false,
      errorCode: removeResponse.errorCode || 'REMOVE_COMMENT_FAILED',
      errorMessage: removeResponse.errorMessage || 'Failed to remove comment',
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: removeResponse.data,
  });
});

module.exports = removeComment;
