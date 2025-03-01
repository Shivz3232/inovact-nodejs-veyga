const { query: Hasura } = require('../../../../utils/hasura');
const {
  replyOnPostComment,
  replyOnIdeaComment,
  replyOnThoughtComment,
} = require('../queries/mutations');

const mutationMap = {
  post: replyOnPostComment,
  idea: replyOnIdeaComment,
  thought: replyOnThoughtComment,
};

async function replyComment(commentType, text, commentId, userId, parentReplyId) {
  const mutation = mutationMap[commentType];

  return await Hasura(mutation, {
    objects: [
      {
        text,
        comment_id: commentId,
        user_id: userId,
        ...(parentReplyId && { parent_reply_id: parentReplyId }),
      },
    ],
  });
}

module.exports = replyComment;
