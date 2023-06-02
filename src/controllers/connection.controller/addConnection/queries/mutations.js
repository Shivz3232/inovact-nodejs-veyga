const addConnection = `mutation addConnection($user1: Int, $user2: Int) {
  insert_connections(objects: [{user1: $user1, user2: $user2}]) {
    returning {
      id
      status
    }
  }
}
`;

module.exports = {
  addConnection,
};
