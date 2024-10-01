const checkCanDeleteRequest = `query checkCanDeleteRequest($cognito_sub: String, $user_id: Int) {
  connections_aggregate(where: { _or: [
    {
      _and: [{user: { cognito_sub: {_eq: $cognito_sub}}}, {user2: { _eq: $user_id }}]
    }
  ], status: { _eq: "pending"}}) {
    aggregate {
      count
    }
  }
}`;

module.exports = {
  checkCanDeleteRequest,
};
