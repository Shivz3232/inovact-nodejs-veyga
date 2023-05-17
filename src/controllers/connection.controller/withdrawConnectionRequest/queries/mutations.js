const deleteRequest = `mutation deleteRequest($cognito_sub: String, $user_id: Int) {
	delete_connections(where: { _or: [
    {
      _and: [{user: { cognito_sub: {_eq: $cognito_sub}}}, {user2: { _eq: $user_id }}]
    },
    {
      _and: [{user1: { _eq: $user_id }}, {userByUser2: { cognito_sub: { _eq: $cognito_sub }}}]
    }
  ]}) {
    affected_rows
  }
}`;

module.exports = {
  deleteRequest,
};
