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

const updateUserFlags = `mutation updateUserEventFlags($id: uuid!, $userEventFlags: user_event_flags_set_input!) {
  update_user_event_flags(where: { id: { _eq: $id } }, _set: $userEventFlags) {
    returning {
      id
    }
  }
}`;

module.exports = {
  addThought,
  updateUserFlags,
};
