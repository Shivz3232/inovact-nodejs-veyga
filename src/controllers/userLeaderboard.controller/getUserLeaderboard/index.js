const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getProviderHasuraInstance } = require('../../../utils/axios');
const { getUserLeaderboardQuery, getRankOfUser } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserLeaderboard = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: sanitizerErrors.array(),
    });
  }

  const { cognito_sub } = req.body;

  // Get pagination parameters from query string
  const pageSize = parseInt(req.query.pageSize, 10) || 50;
  const pageNumber = parseInt(req.query.pageNumber, 10) || 1;

  // Calculate offset
  const offset = (pageNumber - 1) * pageSize;

  const variables = {
    limit: pageSize,
    offset,
    cognito_sub,
  };

  const response = await Hasura(getUserLeaderboardQuery, variables);

  const currentUserId = response.result.data.currentUser[0].user.id;
  const currentUserRankResponse = await Hasura(
    getRankOfUser,
    { user_id: currentUserId },
    getProviderHasuraInstance()
  );

  return res.json({
    success: true,
    data: {
      leaderBoard: response.result.data.user_points.map((rec) => {
        return { ...rec.user, points: rec.points };
      }),
      currentUser: {
        ...response.result.data.currentUser[0].user,
        points: response.result.data.currentUser[0].points,
        rank: currentUserRankResponse.result.data.user_rank[0].rank,
      },
    },
  });
});

module.exports = getUserLeaderboard;
