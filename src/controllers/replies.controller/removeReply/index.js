const { validationResult } = require('express-validator');
const { checkUserAndReply } = require('./queries/queries.js');
const removeReplyFromComment = require('./helpers/removeReplyFromComment.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');

const removeReply = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, commentType } = req.body;
  const { replyId } = req.params;

  // Fetch User ID
  const response = await Hasura(checkUserAndReply, {
    cognito_sub,
    replyId,
  });

  if (!response.result.data.post_comment_replies.length) {
    return res.status(400).json({
      success: false,
      message: 'User not found or the reply doesnt belong to this user',
    });
  }

  const data = await removeReplyFromComment(commentType, replyId);

  return res.status(200).json({
    success: true,
    data: null,
  });
});

module.exports = removeReply;
