const createUserQuery = `mutation CreateUser(
  $email_id: String!
  $university: String!
  $user_name:String!
  $degree: String!
  $graduation_year: String!
  $cognito_sub: String!
  $first_name: String!
  $last_name: String!
  $bio: String
  $avatar: String
) {
  insert_user_one(
    object: {
      email_id: $email_id
      university: $university
      user_name: $user_name
      degree: $degree
      cognito_sub:$cognito_sub
      graduation_year: $graduation_year
      first_name: $first_name
      last_name: $last_name
      bio: $bio
      avatar: $avatar
    }
  ) {
    id
    email_id
    university
    user_name
    degree
    graduation_year
    first_name
    last_name
    bio
    avatar
  }
}
`;

const createUserIntrestQuery = `mutation updateUserInterests($objects: [user_interests_insert_input!]!) {
  insert_user_interests(objects: $objects) {
    affected_rows
  }
}`;

module.exports = {
  createUserQuery,
  createUserIntrestQuery,
};
