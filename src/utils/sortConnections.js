/* eslint-disable prefer-const */
function sortConnections(connections, privateMessages, user_id) {
  privateMessages = privateMessages.map((privateMessage) => {
    privateMessage.created_at = new Date(privateMessage.created_at);

    return privateMessage;
  });

  let connectionsObject = {};

  connections.forEach((connection) => {
    connectionsObject[connection.id] = connection;
  });

  const sortedPrivateMessages = privateMessages.sort(({ created_at: a }, { created_at: b }) => b - a);

  const sortedConnections = new Array(connections.length);

  let i = 0;
  for (; i < sortedPrivateMessages.length; i += 1) {
    const { connection_id } = sortedPrivateMessages[i];
    const connection = connectionsObject[connection_id];

    delete connectionsObject[connection_id];

    let obj = {
      status: connection.status,
    };

    if (connection.user1 === user_id) {
      obj.user = connection.userByUser2;
    } else {
      obj.user = connection.user;
    }

    sortedConnections[i] = obj;
  }

  // Insert the remainig connections
  Object.keys(connectionsObject).forEach((connection) => {
    const obj = {
      status: connectionsObject[connection].status,
    };

    if (connectionsObject[connection].user1 === user_id) {
      obj.user = connectionsObject[connection].userByUser2;
    } else {
      obj.user = connectionsObject[connection].user;
    }

    sortedConnections[i] = obj;
    i += 1;
  });

  return sortedConnections;
}

module.exports = sortConnections;
