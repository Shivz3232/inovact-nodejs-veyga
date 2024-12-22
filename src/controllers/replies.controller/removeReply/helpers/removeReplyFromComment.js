const { query: Hasura } = require('../../../../utils/hasura');
const {
  removeReplyOnPostComment,
  removeReplyOnIdeaComment,
  removeReplyOnThoughtComment,
} = require('../queries/mutations');

async function removeReplyFromComment(commentType, replyId) {
  const mutationMap = {
    post: removeReplyOnPostComment,
    idea: removeReplyOnIdeaComment,
    thought: removeReplyOnThoughtComment,
  };

  const mutation = mutationMap[commentType];

  return await Hasura(mutation, {
    id: replyId,
  });
}

module.exports = removeReplyFromComment;
