const { query: Hasura } = require('../../../../utils/hasura');
const {
  updateReplyOnPostComment,
  updateReplyOnIdeaComment,
  updateReplyOnThoughtComment,
} = require('../queries/mutations');

const mutationMap = {
  post: updateReplyOnPostComment,
  idea: updateReplyOnIdeaComment,
  thought: updateReplyOnThoughtComment,
};

async function updateReplyComment(commentType, text, replyId) {
  const mutation = mutationMap[commentType];

  return await Hasura(mutation, {
    id: replyId,
    text,
  });
}

module.exports = updateReplyComment;
