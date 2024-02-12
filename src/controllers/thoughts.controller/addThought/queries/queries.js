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
  user_event_flag{
  id
  user_id
  has_uploaded_project
  has_uploaded_idea
  has_uploaded_thought
  has_sought_team
  has_sought_mentor
  has_sought_team_and_mentor
  }
  }
}
`;

const getThought = `query getThought($id: Int) {
  thoughts(where: {id: {_eq: $id}}) {
    id
    user_id
   thought
    thought_comments {
      id
      created_at
      updated_at
      user_id
    }
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

const getMyConnections = `query getMyConnections($cognito_sub: String) {
  connections(where: {_or: [{user: {cognito_sub: {_eq: $cognito_sub}}}, {userByUser2: {cognito_sub: {_eq: $cognito_sub}}}], status: {_eq: "connected"}}, order_by :{formed_at :desc}) {
    id
    user1
    user2
  }
}
`;

module.exports = {
  getUser,
  getThought,
  getMyConnections,
};
