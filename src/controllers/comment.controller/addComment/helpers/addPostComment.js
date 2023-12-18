const { query: Hasura } = require('../../../../utils/hasura');
const { commentOnPost } = require('../queries/mutations');

async function addPostComment(text, user_id, post_id) {
  return await Hasura(commentOnPost, { text, user_id, post_id });
}

module.exports = addPostComment;
