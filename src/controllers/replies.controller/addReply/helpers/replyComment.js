const { log } = require('../../../../config/logger');
const { query: Hasura } = require('../../../../utils/hasura');
const {
  replyOnPostComment,
  replyOnIdeaComment,
  replyOnThoughtComment,
} = require('../queries/mutations');

async function replyComment(commentType, text, commentId, userId, parentReplyId) {
  const mutationMap = {
    post: replyOnPostComment,
    idea: replyOnIdeaComment,
    thought: replyOnThoughtComment,
  };

  const mutation = mutationMap[commentType];

  return await Hasura(mutation, {
    text,
    commentId,
    userId,
    parentReplyId,
  });
}

module.exports = replyComment;
