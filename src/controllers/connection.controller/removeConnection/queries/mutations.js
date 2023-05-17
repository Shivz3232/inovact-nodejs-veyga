const removeConnection = `mutation removeUser($user1: Int, $user2: Int) {
  delete_connections(where: { _or: [
    {
      _and: [{ user1: {_eq: $user1}}, {user2: {_eq: $user2}}] 
    },
    {
      _and: [{ user1: {_eq: $user2}}, {user2: {_eq: $user1}}] 
    }
  ], status: { _eq: "connected"}}) {
    affected_rows
  }
}`;

module.exports = {
  removeConnection,
};
