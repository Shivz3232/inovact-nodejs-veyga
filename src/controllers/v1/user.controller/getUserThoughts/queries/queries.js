const getUserThoughts = `query getUserThoughts($user_id: Int, $cognito_sub: String) {
  thoughts(where: {user_id: {_eq: $user_id}}, order_by: {created_at: desc}) {
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
}`;

const getUserThoughtsWithCognitoSub = `query getUserThoughts($cognito_sub: String) {
  thoughts(where: { user: { cognito_sub: { _eq: $cognito_sub }}} , order_by: {created_at: desc}) {
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
}`;

module.exports = {
  getUserThoughts,
  getUserThoughtsWithCognitoSub,
};
