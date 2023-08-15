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

module.exports = {
  getUser,
  getIdea,
};
