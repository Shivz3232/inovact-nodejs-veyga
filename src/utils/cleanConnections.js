const cleanConnections = function (connections, userId) {
  const cleanedConnections = connections.map((connection) => {
    return connection.user1 == userId ? connection.user2 : connection.user1;
  });
  return cleanedConnections;
};

module.exports = cleanConnections;
