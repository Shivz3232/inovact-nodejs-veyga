const getUserIdeasById = `query getUserIdeasById($user_id: Int, $cognito_sub: String) {
    idea(where: {user_id: {_eq: $user_id}}) {
      id
      title
      description
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
      }
    }
  }
  `;

const getUserIdeasByCognitoSub = `query getUserIdeasByCognitoSub($cognito_sub: String) {
    idea(where: {user: {cognito_sub: {_eq: $cognito_sub}}}) {
      id
      title
      description
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
      }
    }
  }`;

module.exports = {
    getUserIdeasById,
    getUserIdeasByCognitoSub,
};
