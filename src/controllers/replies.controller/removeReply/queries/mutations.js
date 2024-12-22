const removeReplyOnPostComment = `mutation removePostCommentReply($id: Int!) {
  delete_post_comment_replies_by_pk(id: $id) {
    id
  }
}
`;

const removeReplyOnIdeaComment = `mutation removePostCommentReply($id: Int!) {
  delete_idea_comment_replies_by_pk(id: $id) {
    id
  }
}
`;

const removeReplyOnThoughtComment = `mutation removePostCommentReply($id: Int!) {
  delete_thought_comment_replies_by_pk(id: $id) {
    id
  }
}
`;

module.exports = {
  removeReplyOnPostComment,
  removeReplyOnIdeaComment,
  removeReplyOnThoughtComment,
};
