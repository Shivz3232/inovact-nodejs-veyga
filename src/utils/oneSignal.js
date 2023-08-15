const axios = require('axios');

async function notify(message, users) {
  const result = await axios
    .post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        contents: {
          en: message,
        },
        include_external_user_ids: users,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
        },
      }
    )
    .then((response) => {
      const responseData = response.data;

      if (responseData.id) {
        return {
          success: true,
          result: responseData,
        };
      }
      return {
        success: false,
        errors: responseData.errors,
      };
    })
    .catch((error) => {
      console.log(error.response.data.errors);

      return {
        success: false,
        errors: error.response.data.errors,
      };
    });

  return result;
}

module.exports = { notify };
