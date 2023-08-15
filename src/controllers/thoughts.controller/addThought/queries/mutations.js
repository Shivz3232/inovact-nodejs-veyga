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

module.exports = {
  addThought,
};
