const updateReplyOnPostComment = `mutation updateReplyOnPostComment($id: Int!, $text: String!) {
  update_post_comment_replies(
    where: { id: { _eq: $id } },
    _set: { text: $text }
  ) {
    returning {
      id
      created_at
      updated_at
      text
      user_id
    }
  }
}
`;

const updateReplyOnIdeaComment = `mutation updateReplyOnIdeaComment($id: Int!, $text: String!) {
  update_idea_comment_replies(
    where: { id: { _eq: $id } },
    _set: { text: $text }
  ) {
    returning {
      id
      created_at
      updated_at
      text
      user_id
    }
  }
}`;

const updateReplyOnThoughtComment = `mutation updateReplyOnThoughtComment($id: Int!, $text: String!) {
  update_thought_comment_replies(
    where: { id: { _eq: $id }},
    _set: { text: $text }
  ) {
    returning {
      id
      created_at
      updated_at
      text
      user_id
    }
  }
}`;

module.exports = {
  updateReplyOnPostComment,
  updateReplyOnIdeaComment,
  updateReplyOnThoughtComment,
};
