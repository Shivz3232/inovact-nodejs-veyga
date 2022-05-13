const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const getUserConnections = `query getMyConnections($user_id: Int) {
  connections(where: {_or: [{user2: {_eq: $user_id}, status: {_eq: "pending"}}, {_and: [{status: {_eq: "connected"}, _or: [{user1: {_eq: $user_id}}, {user2: {_eq: $user_id}}]}]}]}) {
    user1
    user2
    status
    user {
      id
      first_name
      last_name
      avatar
      role
      user_name
    }
    userByUser2 {
      id
      first_name
      last_name
      avatar
      role
      user_name
    }
  }
}

`;

module.exports = {
  getUserConnections,
  getUserId,
};
