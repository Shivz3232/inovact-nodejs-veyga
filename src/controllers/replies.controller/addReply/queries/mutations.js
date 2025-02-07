const replyOnPostComment = `mutation post_comment_replies($text: String!, $commentId: Int!, $userId: Int, $parentReplyId: Int) {
          insert_post_comment_replies_one(object: {
            text: $text,
            comment_id: $commentId,
            user_id: $userId,
            parent_reply_id: $parentReplyId
          }) {
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
        }`;

const replyOnIdeaComment = `mutation replyOnIdeaComment($text: String, $user_id: Int, $idea_id: Int) {
  insert_idea_comment(objects: [{ text: $text, user_id: $user_id, idea_id: $idea_id}]) {
    returning {
      id
      user_id
      idea_id
      idea {
        user_id
      }
      text
      created_at
      updated_at
    }
  }
}`;

const replyOnThoughtComment = `mutation replyOnThoughtComment($text: String, $user_id: Int, $thought_id: Int) {
  insert_thought_comments(objects: [{ text: $text, user_id: $user_id, thought_id: $thought_id}]) {
    returning {
      id
      user_id
      thought_id
   		thought {
        user_id
      }   
      text
      created_at
      updated_at
    }
  }
}`;

module.exports = {
  replyOnPostComment,
  replyOnIdeaComment,
  replyOnThoughtComment,
};
