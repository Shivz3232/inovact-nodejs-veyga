const getThoughts = `query getThoughts($cognito_sub: String, $blocked_user_ids: [Int!]) {
  thoughts(order_by: {created_at:desc} ,where :{ user: { status: { _neq: 0 }, id: { _nin: $blocked_user_ids } } }) {
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

const getThought = `query getThought($id: Int, $cognito_sub: String,  $blocked_user_ids: [Int!]) {
  thoughts (where: {  id :{_eq: $id}  , { user: { status: { _neq: 0 }, id: { _nin: $blocked_user_ids } } }}) {
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
user_blocked_users(where: {
    userByUserId:{
      cognito_sub: {
        _eq: $cognito_sub
      }
    }
  }){
    blocked_user_id
  }
}`;

module.exports = {
  getThoughts,
  getThought,
  getConnections,
};
