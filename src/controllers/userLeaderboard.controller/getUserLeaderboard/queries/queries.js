const getUserLeaderboardQuery = `query getUserLeaderboard($limit: Int!, $offset: Int!, $cognito_sub: String) {
  user_points(order_by: {points: desc}, limit: $limit, offset: $offset, where: {user: {cognito_sub: {_neq: $cognito_sub}}}) {
    user {
      id
      first_name
      last_name
      role
      organization
      avatar
    }
    points
  }
  currentUser: user_points(where: {user: {cognito_sub: {_eq: $cognito_sub}}}) {
    user {
      id
      first_name
      last_name
      role
      organization
      avatar
    }
    points
  }
}`;

const getRankOfUser = `query getUserLeaderboard($user_id: Int!) {
  user_rank(args: {user_id: $user_id}) {
    rank
  }
}`;

module.exports = { getUserLeaderboardQuery, getRankOfUser };
