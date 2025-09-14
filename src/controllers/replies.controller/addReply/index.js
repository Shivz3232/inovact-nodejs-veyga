const { validationResult } = require('express-validator');
const { getUserId } = require('./queries/queries.js');
const replyComment = require('./helpers/replyComment.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');
const notify = require('../../../utils/notify');

const entityTypeMap = {
  post: 'project_comment',
  idea: 'idea_comment',
  thought: 'thought_comment',
};

const addReply = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { text, parentReplyId, cognito_sub, commentType } = req.body;
  const { commentId } = req.params;

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

  const data = await replyComment(commentType, text, commentId, userId, parentReplyId || null);

  const tableName = Object.keys(data.result.data)[0];

  const notifierId = data.result.data[tableName].returning[0][entityTypeMap[commentType]].user.id;

  console.log(27, data.result.data[tableName].returning[0].id, userId, [notifierId]);

  notify(27, data.result.data[tableName].returning[0].id, userId, [notifierId]);

  return res.status(201).json({
    success: true,
    data: data.result.data[`insert_${commentType}_comment_replies`],
  });
});

module.exports = addReply;
