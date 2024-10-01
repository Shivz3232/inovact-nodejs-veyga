const checkCanDeleteRequest = `query checkCanDeleteRequest($cognito_sub: String, $request_id: Int) {
  team_requests(where: {id: {_eq: $request_id}, user: { cognito_sub: {_eq: $cognito_sub}}}) {
    id
  }
}`;

module.exports = {
  checkCanDeleteRequest,
};
