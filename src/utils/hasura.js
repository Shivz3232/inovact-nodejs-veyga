const { createInstance: createAxiosInstance } = require('./axios');

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
      const errors = {
        name: 'QueryError',
        message: data.errors,
      };
      throw errors;
    })
    .catch((err) => {
      if (err.name === 'QueryError') {
        throw err;
      } else {
        throw { name: 'RequestError', code: err.code, message: err.message };
      }
    });

  return result;
}

module.exports = { query };
