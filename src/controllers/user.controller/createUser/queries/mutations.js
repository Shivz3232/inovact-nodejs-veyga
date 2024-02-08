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

module.exports = {
  createUserQuery,
  addTutorialCompleteStatus,
};
