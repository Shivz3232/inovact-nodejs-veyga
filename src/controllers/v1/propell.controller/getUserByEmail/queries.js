const getUserFromEmail = `
query getUser($email_id: String) {
  user(where: {email_id: {_eq: $email_id}}) {
    id
    user_name
    bio
    avatar
    phone_number
    email_id
    designation
    organization
    organizational_role
    university
    graduation_year
    journey_start_date
    years_of_professional_experience
    created_at
    updated_at
    first_name
    last_name
    role
    cognito_sub
    admin
    website
    profile_complete,
    status,
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
  connections(where: { id: { _eq: 0 } }) {
    status
  }
}`;

module.exports = {
  getUserFromEmail,
};