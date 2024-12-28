const { query: Hasura } = require('../../../../utils/hasura');
const {
  removeReplyOnPostComment,
  removeReplyOnIdeaComment,
  removeReplyOnThoughtComment,
} = require('../queries/mutations');

const mutationMap = {
  post: removeReplyOnPostComment,
  idea: removeReplyOnIdeaComment,
  thought: removeReplyOnThoughtComment,
};

async function removeReplyFromComment(commentType, replyId) {
  const mutation = mutationMap[commentType];

  return await Hasura(mutation, {
    id: replyId,
  });
}

module.exports = removeReplyFromComment;
