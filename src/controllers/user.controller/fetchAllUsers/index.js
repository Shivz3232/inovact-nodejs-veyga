const catchAsync = require('../../../utils/catchAsync');
const { getAllUserQuery } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');

const getAllUsers = catchAsync(async (req, res) => {
  const response = await Hasura(getAllUserQuery, {});

  return res.json(response.result.data.user);
});

module.exports = getAllUsers;
