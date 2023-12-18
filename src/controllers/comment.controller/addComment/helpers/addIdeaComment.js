const { query: Hasura } = require('../../../../utils/hasura');
const { commentOnIdea } = require('../queries/mutations');

async function addIdeaComment(text, user_id, idea_id) {
  return await Hasura(commentOnIdea, { text, user_id, idea_id });
}

module.exports = addIdeaComment;
