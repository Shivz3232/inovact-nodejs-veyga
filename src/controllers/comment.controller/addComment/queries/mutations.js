const commentOnPost = `mutation commentOnPost($text: String, $user_id: Int, $post_id: Int) {
  insert_project_comment(objects: [{ text: $text, user_id: $user_id, project_id: $post_id}]) {
    returning {
      id
      user_id
      project_id
      project {
        user_id
      }
      text
      created_at
      updated_at
    }
  }
}`;

const commentOnIdea = `mutation commentOnIdea($text: String, $user_id: Int, $idea_id: Int) {
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

const commentOnThought = `mutation commentOnThought($text: String, $user_id: Int, $thought_id: Int) {
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
  commentOnIdea,
  commentOnPost,
  commentOnThought,
};
