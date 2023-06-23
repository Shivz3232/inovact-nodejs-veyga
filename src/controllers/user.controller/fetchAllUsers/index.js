const catchAsync = require('../../../utils/catchAsync');
const { getAllUserQuery } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');
const logger = require('../../../config/logger');

const getAllUsers = catchAsync(async (req, res) => {
  const response = await Hasura(getAllUserQuery, {});

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch user data',
    });
  }

  return res.json(response.result.data.user);
});

module.exports = getAllUsers;
