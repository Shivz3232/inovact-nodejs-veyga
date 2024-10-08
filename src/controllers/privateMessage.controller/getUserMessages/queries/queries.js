const getUserConnections = `query getMyConnections($cognito_sub: String) {
    connections(
      where: {
        _or: [
          { userByUser2: { cognito_sub: { _eq: $cognito_sub } }, status: { _eq: "pending" } }
          {
            _and: [
              { status: { _eq: "connected" } }
              {
                _or: [
                  { user: { cognito_sub: { _eq: $cognito_sub } } }
                  { userByUser2: { cognito_sub: { _eq: $cognito_sub } } }
                ]
              }
            ]
          }
        ]
      }
    ) {
      id
      user1
      user2
      status
      user {
        id
        first_name
        last_name
        avatar
        role
        user_name
      }
      userByUser2 {
        id
        first_name
        last_name
        avatar
        role
        user_name
      }
      private_messages(order_by: { created_at: desc }, limit: 1) {
        primary_user_id
        secondary_user_id
        encrypted_message
        created_at
        seen
      }
      private_messages_aggregate(where: { _and:{
        seen:{
          _eq : false
        },
        userBySecondaryUserId : {
          cognito_sub : {
            _eq: $cognito_sub
          }
        }
      } }) {
        aggregate {
          count
        }
      }
    }
    user(where: { cognito_sub: { _eq: $cognito_sub } }) {
      id
    }
  }`;

module.exports = {
  getUserConnections,
};
