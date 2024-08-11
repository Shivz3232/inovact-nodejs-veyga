const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserLeaderboardQuery } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserLeaderboard = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: sanitizerErrors.array(),
    });
  }

  // Get pagination parameters from query string
  const pageSize = parseInt(req.query.pageSize) || 50;
  const pageNumber = parseInt(req.query.pageNumber) || 1;

  // Calculate offset
  const offset = (pageNumber - 1) * pageSize;

  const variables = {
    limit: pageSize,
    offset: offset,
  };

  const response = await Hasura(getUserLeaderboardQuery, variables);

  const responseData = response.result.data;

  return res.json({
    success: true,
    data: responseData.user_points,
  });
});

module.exports = getUserLeaderboard;
