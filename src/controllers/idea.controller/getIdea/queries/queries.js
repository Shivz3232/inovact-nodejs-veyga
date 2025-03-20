const getIdeas = `query getIdeas($cognito_sub: String,  $blocked_user_ids: [Int!]) {
  idea(order_by: {created_at:desc} ,where : { user: { status: { _neq: 0 }, id: { _nin: $blocked_user_ids } } }) {
    id
    title
    description
    user_id
    team_id
    status
    link
    idea_tags {
      hashtag {
        name
      }
    }
    idea_likes: idea_likes_aggregate {
      result: aggregate {
        count
      }
    }
    has_liked: idea_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
      result: aggregate {
        count
      }
    }
    idea_comments {
      id
      created_at
      text
      updated_at
      user {
        id
        first_name
        last_name
        avatar
      }
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
    team {
      id
      looking_for_members
      looking_for_mentors
      name
      avatar
      team_members {
        user {
          id
          first_name
          last_name
          user_name
          role
          admin
          avatar
        }
      }
    }
  }
}
`;

const getIdea = `query getIdea($id: Int, $cognito_sub: String,  $blocked_user_ids: [Int!]) {
  idea (where: {  id :{_eq: $id}, { user: { status: { _neq: 0 }, id: { _nin: $blocked_user_ids } } }}) {
    id
    title
    description
    team_id
    user_id
    status
    link
    idea_tags {
      hashtag {
        name
      }
    }
    idea_likes: idea_likes_aggregate {
      result: aggregate {
        count
      }
    }
    has_liked: idea_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
      result: aggregate {
        count
      }
    }
    idea_comments {
      id
      created_at
      text
      updated_at
      user {
        id
        first_name
        last_name
        avatar
      }
    }
    user {
      id
      avatar
      first_name
      last_name
      role
    }
    team {
      id
      looking_for_members
      looking_for_mentors
      name
      avatar
      team_members {
        user {
          id
          first_name
          last_name
          user_name
          role
          admin
          avatar
        }
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
  getIdea,
  getIdeas,
  getConnections,
};
