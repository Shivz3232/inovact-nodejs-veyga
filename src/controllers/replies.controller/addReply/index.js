const { validationResult } = require('express-validator');
const { getUserId } = require('./queries/queries.js');
const replyComment = require('./helpers/replyComment.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');

const addComment = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { text, parentReplyId, cognito_sub, commentType } = req.body;
  const { commentId } = req.params;

  // Validation
  if (!text || !commentId || !commentType) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: text, commentId, or commentType',
    });
  }

  // Fetch User ID
  const response = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response.result.data.user.length) {
    return res.status(400).json({
      success: false,
      message: 'User not found',
    });
  }

  const userId = response.result.data.user[0].id;

  // Add Reply
  try {
    const data = await replyComment(commentType, text, commentId, userId, parentReplyId || null);
    console.log(JSON.stringify(data));

    return res.status(201).json({
      success: true,
      data: data.result.data.insert_post_comment_replies_one,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = addComment;
