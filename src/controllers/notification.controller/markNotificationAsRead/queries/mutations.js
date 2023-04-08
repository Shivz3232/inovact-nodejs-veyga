const markNotificationAsRead = `mutation markNotificationAsRead($cognito_sub: String, $ids: [Int!]) {
  update_notification(where: {id: {_in: $ids}, user: { cognito_sub: {_eq: $cognito_sub}}}, _set: {status: 0}) {
    affected_rows
  }
}`;

module.exports = {
  markNotificationAsRead,
};
