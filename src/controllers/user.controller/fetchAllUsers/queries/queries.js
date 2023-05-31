const getAllUserQuery = `
    query getUsers {
      user {
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

module.exports = { getAllUserQuery };
