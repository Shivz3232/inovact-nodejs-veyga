/* eslint-disable prefer-const */
function sortConnections(users) {
  const sortedByMessage = users.sort((a, b) => {
    const aDate = a.private_messages.length ? new Date(a.private_messages[0].created_at) : new Date(0);
    const bDate = b.private_messages.length ? new Date(b.private_messages[0].created_at) : new Date(0);
    return bDate - aDate;
  });

  const SortedConnections = sortedByMessage.map(function (connection) {
    const obj = {
      status: connection.status,
      id: connection.id,
    };
    return obj;
  });

  return SortedConnections;
}

module.exports = sortConnections;
