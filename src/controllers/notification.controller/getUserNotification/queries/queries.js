const getNotifications = `query getNotifications($cognito_sub: String) {
  notification(where: {user: {cognito_sub: {_eq: $cognito_sub}}, status: {_eq: 1}}, order_by: { created_at: desc }) {
    id
    created_at
    notification_object {
      id
      entity_id
      entity_type_id
      notification_changes {
        id
        user {
          id
          role
          avatar
          first_name
          last_name
        }
      }
    }
  }
}`;

module.exports = {
  getNotifications,
};
