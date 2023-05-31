const axios = require('axios');
const catchAsync = require('../../../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
  const query = `
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

  const response = await axios
    .post(
      process.env.HASURA_API,
      { query, variables: {} },
      {
        headers: {
          'content-type': 'application/json',
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
      }
    )
    .then((res) => {
      console.log(res.data.data.user[res.data.data.user.length - 1]);
      return res;
    })
    .catch((err) => {
      return null;
    });

  return res.json(response.data.data.user);
});

module.exports = getAllUsers;
