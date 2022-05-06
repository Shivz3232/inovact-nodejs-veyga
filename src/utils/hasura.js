const axios = require('axios');
const config = require('../config/config');

/**
 * This is a utility function for querying the postgresql database
 * @param {string} queryString
 * @param {object} variables
 * @returns {Object}
 */
async function query(queryString, variables = {}) {
  const result = await axios
    .post(
      config.hasuraApi,
      { query: queryString, variables },
      {
        headers: {
          'content-type': 'application/json',
          'x-hasura-admin-secret': config.hasuraAdminSecret,
        },
      }
    )
    .then((response) => {
      const responseData = response.data;

      if (responseData.data) {
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
    .catch((err) => {
      return {
        success: false,
        errors: err,
      };
    });

  return result;
}

module.exports = { query };
