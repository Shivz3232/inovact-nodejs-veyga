const getThoughts = `query getThoughts($cognito_sub: String) {
    thoughts(limit:20, order_by: {created_at:desc}) {
      id
      thought
      user_id
      thought_likes: thought_likes_aggregate  {
        result: aggregate {
          count
        }
      }
      has_liked: thought_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
        result: aggregate {
          count
        }
      }
      thought_comments {
        id
        created_at
        updated_at
        user {
          id
          first_name
          last_name
          avatar
        }
        text
      }
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
  `;

const getThought = `query getThought($id: Int, $cognito_sub: String) {
  thoughts (where: { id: { _eq: $id }}) {
    id
    thought
    user_id
    user {
      id
      avatar
      first_name
      last_name
      role
    }
    thought_comments {
      id
      created_at
      updated_at
      user {
        id
        first_name
        last_name
        avatar
      }
      text
    }
    thought_likes: thought_likes_aggregate  {
      result: aggregate {
        count
      }
    }
    has_liked: thought_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
      result: aggregate {
        count
      }
    }
    created_at
    updated_at
  }
}
  `;

const getConnections = `query getConnections($cognito_sub: String) {
  connections(where: {
    _or: [
      { user: {cognito_sub: {_eq: $cognito_sub }}},
      { userByUser2: {cognito_sub: {_eq: $cognito_sub }}}
    ]
  }) {
    user1
    user2
    status
  }
  user (where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
  }
}`;

module.exports = {
    getThoughts,
    getThought,
    getConnections
};
