const deleteRequest = `mutation deleteRequest($cognito_sub: String, $user_id: Int) {
	delete_connections(where: { 
      _and: [{user: { cognito_sub: {_eq: $cognito_sub}}}, {user2: { _eq: $user_id }}]
  }) {
    affected_rows
  }
}`;

module.exports = {
  deleteRequest,
};
