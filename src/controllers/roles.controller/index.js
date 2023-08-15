const { query: Hasura } = require('../../utils/hasura');
const { getRoles: getRolesQueries, getRolesWithPrefix } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');

const getRoles = catchAsync(async (req, res) => {
  const { prefix } = req.query;

  let response;
  if (prefix) {
    response = await Hasura(getRolesWithPrefix, {
      _role: `${prefix}%`,
    });
  } else {
    response = await Hasura(getRolesQueries);
  }

  return res.json(response.result.data.roles);
});

module.exports = getRoles;
