const addThought = `mutation add_thought($thought: String!, $user_id:Int , ) {
  insert_thoughts(objects: [{
    thought: $thought,
    user_id: $user_id
	
  }]) {
    returning {
      id,
      thought,
      user_id,
      created_at
      updated_at
      user {
        id
        avatar
        first_name
        last_name
        role
      }
    }
  }
}`;

const updateUserFlags = `mutation updateUserEventFlags($userId: Int!, $userEventFlags: user_actions_set_input!) {
  update_user_actions(where: { user_id: { _eq: $userId } }, _set: $userEventFlags) {
    returning {
      id
      feed_tutorial_complete
      team_tutorial_complete
      profile_tutorial_complete
      has_uploaded_project
      has_uploaded_idea
      has_uploaded_thought
      has_sought_team
      has_sought_mentor
      has_sought_team_and_mentor
    }
  }
}`;

module.exports = {
  addThought,
  updateUserFlags,
};
