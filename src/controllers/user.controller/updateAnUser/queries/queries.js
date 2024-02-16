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
    website
    github_profile
    cover_photo
    profile_complete
    user_skills {
      id
      skill
      level
    }
    user_interests {
      area_of_interest {
        id
        interest
      }
    }
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
  }
}
`;

const checkPhoneNumber = `query checkPhoneNumber($phoneNumber: String) {
  user_aggregate(where: {phone_number: {_eq: $phoneNumber}}) {
    aggregate {
      count
    }
  }
}`;

const getUserIdFromCognito = `query getUserIdFromCognito($cognito_sub: String) {
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
  }
}`;

const getUserActivityDetails = `query getUserActivities($cognitoSub: String) {
  user_activities(where: { user:{
    cognito_sub:{
      _eq: $cognitoSub
    }
  } }) {
    id
    user_id
    direction
    activity_id
    status
    activity{
      identifier
    }
  }
}`;

module.exports = {
  getUser,
  getProject,
  checkPhoneNumber,
  getUserIdFromCognito,
  getUserActivityDetails,
};
