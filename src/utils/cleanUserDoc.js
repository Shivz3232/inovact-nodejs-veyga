function cleanUserdoc(userDoc, connection) {
  const temp = new Date(userDoc.graduation_year);

  if (!Number.isNaN(temp)) userDoc.graduation_year = temp.getFullYear();

  const connections_status = connection ? connection.status : 'not connected';

  return {
    ...userDoc,
    success: true,
    user_interests: userDoc.user_interests.map((user_interest) => {
      return {
        id: user_interest.area_of_interest.id,
        interest: user_interest.area_of_interest.interest,
      };
    }),
    connections_status,
  };
}

module.exports = cleanUserdoc;
