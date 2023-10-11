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

module.exports = {
  createUserQuery,
};
