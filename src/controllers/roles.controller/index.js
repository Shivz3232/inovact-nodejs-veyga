const { query: Hasura } = require('../../utils/hasura');
const { getRoles: getRolesQueries, getRolesWithPrefix } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../config/logger');

const getRoles = catchAsync(async (req, res) => {
  const prefix = req.query.prefix;

  let response;
  if (prefix) {
    response = await Hasura(getRolesWithPrefix, {
      _role: prefix + '%',
    });
  } else {
    response = await Hasura(getRolesQueries);
  }

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json(response.errors);
  }
  return res.json(response.result.data.roles);
});

module.exports = getRoles;
