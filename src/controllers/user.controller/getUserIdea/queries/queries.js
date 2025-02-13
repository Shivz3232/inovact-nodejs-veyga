const getUserIdeasById = `query getUserIdeasById($user_id: Int, $cognito_sub: String) {
  idea(where: {user_id: {_eq: $user_id}}, order_by: {created_at: desc}) {
    id
    title
    description
    status
    user_id
    team_id
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

const getUserIdeasByCognitoSub = `query getUserIdeasByCognitoSub($cognito_sub: String) {
  idea(where: {user: {cognito_sub: {_eq: $cognito_sub}}} ,order_by: {created_at: desc}) {
    id
    title
    description
    status
    user_id
    team_id
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
}`;

module.exports = {
  getUserIdeasById,
  getUserIdeasByCognitoSub,
};
