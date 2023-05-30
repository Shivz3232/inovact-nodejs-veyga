const getUser = `query getUser($cognito_sub: String) {
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
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
  connections(where: {id: {_eq: 0}}) {
    status
  }
}`;

const getUserById = `
query getUser($id: Int, $cognito_sub: String) {
  user(where: {id: {_eq: $id}}) {
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
  connections(where: { _or: [
    {
      _and: [{user1: { _eq: $id }}, {userByUser2: {cognito_sub: { _eq: $cognito_sub }}}]
    },
    {
      _and: [{user: { cognito_sub: { _eq: $cognito_sub }}}, {user2: { _eq: $id }}]
    }
  ]}) {
      status
    }
}`;

module.exports = {
  getUser,
  getUserById,
};
