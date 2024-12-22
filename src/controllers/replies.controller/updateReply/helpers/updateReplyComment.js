const { query: Hasura } = require('../../../../utils/hasura');
const {
  updateReplyOnPostComment,
  updateReplyOnIdeaComment,
  updateReplyOnThoughtComment,
} = require('../queries/mutations');

async function updateReplyComment(commentType, text, replyId) {
  const mutationMap = {
    post: updateReplyOnPostComment,
    idea: updateReplyOnIdeaComment,
    thought: updateReplyOnThoughtComment,
  };

  const mutation = mutationMap[commentType];

  return await Hasura(mutation, {
    id: replyId,
    text,
  });
}

module.exports = updateReplyComment;
