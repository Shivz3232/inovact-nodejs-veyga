const { query: Hasura } = require('../../../utils/hasura');
const { commentOnThought } = require('../queries/mutations');

async function addThoughtComment(text, user_id, thought_id) {
  return await Hasura(commentOnThought, { text, user_id, thought_id });
}

module.exports = addThoughtComment;
