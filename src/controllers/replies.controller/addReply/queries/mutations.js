const replyOnPostComment = `mutation post_comment_replies($objects: [post_comment_replies_insert_input!]!) {
  insert_post_comment_replies(objects: $objects) {
    returning {
      id
      text
      created_at
      updated_at
      user {
        id
        first_name
        last_name
      }
      post_comment_replies {
        id
        text
      }
    }
  }
}`;

const replyOnIdeaComment = `mutation idea_comment_replies($objects: [idea_comment_replies_insert_input!]!) {
  insert_idea_comment_replies(objects: $objects) {
    returning {
      id
      text
      created_at
      updated_at
      user {
        id
        first_name
        last_name
      }
      idea_comment_replies {
        id
        text
      }
    }
  }
}`;

const replyOnThoughtComment = `mutation thought_comment_replies($objects: [thought_comment_replies_insert_input!]!) {
  insert_thought_comment_replies(objects: $objects) {
    returning {
      id
      text
      created_at
      updated_at
      user {
        id
        first_name
        last_name
      }
      thought_comment_replies {
        id
        text
      }
    }
  }
}`;

module.exports = {
  replyOnPostComment,
  replyOnIdeaComment,
  replyOnThoughtComment,
};
