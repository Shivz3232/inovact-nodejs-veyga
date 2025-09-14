const getNotifications = `query getNotifications($cognito_sub: String, $limit: Int!, $offset: Int!) {
  notification_aggregate(where: {user: {cognito_sub: {_eq: $cognito_sub}}}) {
    aggregate {
      count
    }
  }
  notification(
    where: {user: {cognito_sub: {_eq: $cognito_sub}}}
    order_by: { created_at: desc }
    limit: $limit
    offset: $offset
  ) {
    id
    created_at
    status
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
