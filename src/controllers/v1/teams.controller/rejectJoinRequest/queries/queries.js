const checkIfPossibleToAccept = `query checkIfPossibleToAccept($cognito_sub: String, $request_id: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team: {team_requests: {id: {_eq: $request_id}}}}) {
    admin
  }
  team_requests(where:  {id: {_eq: $request_id}}) {
    team_id
    user_id
  }
}`;

module.exports = {
  checkIfPossibleToAccept,
};
