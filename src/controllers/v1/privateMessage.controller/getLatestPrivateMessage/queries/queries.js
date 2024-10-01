const getPrivateMessages = `query getPrivateMessages($cognito_sub: String, $user_id: Int) {
  private_messages(where: {
    _or: [
      {
        _and: [
          {primary_user_id: {_eq: $user_id}}, {userBySecondaryUserId: {cognito_sub: {_eq: $cognito_sub}}}
        ]
      },
      {
        _and: [
          {secondary_user_id: {_eq: $user_id}}, {user: {cognito_sub: {_eq: $cognito_sub}}}
        ]
      }
    ],
  }, order_by: { created_at: asc }) {
    created_at
    id
    encrypted_message
    seen
    sender: user {
      id
      first_name
      last_name
      role
      avatar
    }
    receiver: userBySecondaryUserId {
      id
      avatar
      first_name
      last_name
      role
    }
  }
}
`;

module.exports = {
  getPrivateMessages,
};
