const createUserQuery = `mutation CreateUser(
  $email_id: String!
  $user_name:String!
  $cognito_sub: String!
) {
  insert_user_one(
    object: {
      email_id: $email_id
      user_name: $user_name
      cognito_sub:$cognito_sub
    }
  ) {
    id
    email_id
    user_name
  }
}
`;

const addTutorialCompleteStatus = `mutation addTutorialCompleteStatus($userId: Int!) {
  insert_user_actions(
    objects: [
      {
        user_id: $userId
      }
    ]
  ) {
    affected_rows
  }
}
`;

const updateUserPoints = `mutation setUserPoints($userId:Int, $points:Int){
  insert_user_points(objects:{
    user_id:$userId
    points:$points
  }){
    returning{
      id
      user_id
      points
    }
  }
}`;

module.exports = {
  createUserQuery,
  addTutorialCompleteStatus,
  updateUserPoints,
};
