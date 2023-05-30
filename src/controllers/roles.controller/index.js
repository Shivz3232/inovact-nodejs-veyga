const { query: Hasura } = require('../../utils/hasura');
const { getRoles: getRolesQueries, getRolesWithPrefix } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');

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

  console.log(response);

  if (!response.success) {
    return res.json(response.errors);
  }
  return res.json(response.result.data.roles);
});

module.exports = getRoles;
