const getUserLeaderboardQuery = `query getUserLeaderboard($limit: Int!, $offset: Int!) {
      user_points(order_by: {points: desc}, limit: $limit, offset: $offset) {
        user {
          first_name
          last_name
          role
          organization
          avatar
        }
        points
      }
}`;

module.exports = { getUserLeaderboardQuery };
