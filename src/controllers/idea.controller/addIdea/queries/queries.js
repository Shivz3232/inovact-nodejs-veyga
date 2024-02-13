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
    user_action{
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

const getIdea = `query getIdea($id: Int) {
    idea(where: {id: {_eq: $id}}) {
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
      idea_likes {
        user_id
      }
      idea_comments {
        id
        created_at
        text
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
  getIdea,
  getMyConnections,
};
