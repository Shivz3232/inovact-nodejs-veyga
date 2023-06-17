const { createInstance: createAxiosInstance } = require('./axios');
const logger = require('../config/logger');

/**
 * This is a utility function for querying the postgresql database
 * @param {string} queryString
 * @param {object} variables
 * @returns {Object}
 */
async function query(queryString, variables = {}) {
  const axiosInstance = await createAxiosInstance();

  const result = await axiosInstance
    .post(null, { query: queryString, variables })
    .then((response) => {
      const { data } = response;

      if (data.data) {
        return {
          success: true,
          result: data,
        };
      }
      return {
        success: false,
        errors: data.errors,
      };
    })
    .catch((err) => {
      logger.error(err.code, err.message);

      return {
        success: false,
        errors: 'Failed to reach database',
      };
    });

  return result;
}

module.exports = { query };
