const getAllUsersQuery = `
  query getAllUsers($cognito_sub: String!) {
    user_info: user(where: { cognito_sub: { _eq: $cognito_sub } }) {
      university
    }
    all_users: user(
      where: { profile_complete: { _eq: true } }
      order_by: [
        { university: { _order: "asc", _nulls: "last" } },
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
    }
  }`;

module.exports = { getAllUsersQuery }