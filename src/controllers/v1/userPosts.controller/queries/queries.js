const getUserPosts = `query getProjects($user_id: Int, $cognito_sub: String) {
    project(where: { user_id: { _eq: $user_id }}) {
      id
      title
      description
      link
      project_tags {
        hashtag {
          name
        }
      }
      project_likes: project_likes_aggregate {
        result: aggregate {
          count
        }
      }
      has_liked: project_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
        result: aggregate {
          count
        }
      }
      project_comments {
        id
        text
        user_id
      }
      project_mentions {
        user {
          id
          user_name
        }
      }
      project_documents {
        id
        name
        url
        uploaded_at
      }
      status
      team_id
      completed
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

const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
    user(where: { cognito_sub: $cognito_sub }) {
      id
    }
  }
  `;

module.exports = {
  getUserPosts,
  getUserId,
};
