const getConnectionDetails = `query getConnectionDetails($user_id: Int, $cognito_sub: String) {
  connections(where: {_or: [{_and: [{user: {cognito_sub: {_eq: $cognito_sub}}}, {user2: {_eq: $user_id}}]}, {_and: [{userByUser2: {cognito_sub: {_eq: $cognito_sub}}}, {user1: {_eq: $user_id}}]}], status: {_eq: "connected"}}) {
    id
  }
  user(where: { cognito_sub: { _eq: $cognito_sub }}) {
    id
    first_name
    last_name
  }
}`;

module.exports = {
  getConnectionDetails,
};
