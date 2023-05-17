// Requires Cognito_sub
const getUser = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
  id,
  user_name,
  bio,
  avatar,
  phone_number,
  email_id,
  designation,
  organization,
  organizational_role,
  university,
  graduation_year,
  journey_start_date,
  years_of_professional_experience,
  created_at,
  updated_at,
  first_name,
  last_name,
  role,
  cognito_sub,
  admin,
  profile_complete
  }
}
`;

const getProject = `query getProject($id: Int) {
  project(where: { id: { _eq: $id }}) {
    id
    title
    description
    project_tags {
      hashtag {
        name
      }
    }
    project_likes {
      user_id
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
}
`;

module.exports = {
  getUser,
  getProject,
};
