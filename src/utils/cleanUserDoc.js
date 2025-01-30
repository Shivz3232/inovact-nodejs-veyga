function cleanUserdoc(userDoc, connection, options = {}) {
  const temp = new Date(userDoc.graduation_year);
  if (!Number.isNaN(temp)) userDoc.graduation_year = temp.getFullYear();

  const connections_status = connection ? connection.status : 'not connected';
  const sender_id = connection ? connection.sender_id : -1;

  const cleanedDoc = {
    ...userDoc,
    success: true,
    user_interests: userDoc.user_interests.map((user_interest) => ({
      id: user_interest.area_of_interest.id,
      interest: user_interest.area_of_interest.interest,
    })),
    connections_status,
    sender_id,
  };

  if (options.connectionsCount !== undefined) {
    cleanedDoc.numOfConnections = options.connectionsCount;
  }

  if (options.teamsCount !== undefined) {
    cleanedDoc.teamsJoined = options.teamsCount;
  }

  return cleanedDoc;
}

module.exports = cleanUserdoc;
