const getPrivateChats = `query getPrivateChats($connection_ids: [Int!]) @cached {
  users : connections(where: {id: {_in: $connection_ids}}) {
    id
    status
    private_messages(order_by: {created_at: desc}, limit: 1) {
      id
      created_at
    }
  }
}`;

const getUserConnections = `query getMyConnections($cognito_sub: String) {
  connections(where: {_or: [{userByUser2: {cognito_sub: {_eq: $cognito_sub}}, status: {_eq: "pending"}}, {_and: [{status: {_eq: "connected"}, _or: [{user: {cognito_sub: {_eq: $cognito_sub}}}, {userByUser2: {cognito_sub: {_eq: $cognito_sub}}}]}]}]}) {
    id
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
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
  }
}`;

module.exports = {
  getUserConnections,
  getPrivateChats,
};