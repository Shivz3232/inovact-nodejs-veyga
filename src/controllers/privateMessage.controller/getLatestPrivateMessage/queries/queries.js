const getPrivateMessages = `query getPrivateMessages($cognito_sub: String, $user_id: Int, $timeStamp: timestamptz) {
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
    created_at: { _lte: $timeStamp}}, limit: 50, order_by: { created_at: asc }) {
    created_at
    id
    encrypted_message
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
