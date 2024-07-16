const getUserLeaderboardQuery = `query getUserLeaderboard($cognitoSub:String){
  user(where:{
    cognito_sub: {
      _eq: $cognitoSub
    }
  }){
    id
  }
  user_points(order_by: {
    points: desc
  }){
    user{
      first_name
      last_name
      role
      organization
      avatar
    }
    points
  }
}`;

module.exports = { getUserLeaderboardQuery}