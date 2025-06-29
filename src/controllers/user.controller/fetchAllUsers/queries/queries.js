const getAllUsersQuery = `
  query getAllUsers($cognito_sub: String!, $usersToExclude: [Int!], $search: String) {
    user_info: user(where: { cognito_sub: { _eq: $cognito_sub } }) {
      university
    }
    all_users: user(
      where: { 
        profile_complete: { _eq: true }, 
        id: { _nin: $usersToExclude },
        _or: [
          { first_name: { _ilike: $search } },
          { last_name: { _ilike: $search } }
        ]
      }
      order_by: [
        { university: asc_nulls_last },
        { first_name: asc },
        { last_name: asc }
      ]
    ) {
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
      github_profile
      cover_photo
      admin
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

const getBlockedUsers = `query getBlockedUsers($cognito_sub: String) {
  user_blocked_users(where: { user:{
    cognito_sub: {
      _eq: $cognito_sub
    }
  }}) {
    user_id
    blocked_user_id
  }
}`;

module.exports = { getAllUsersQuery, getBlockedUsers };
