const checkIfMember = `query checkIfMember($cognitoSub: String, $teamId: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognitoSub}}, team: {id: {_eq: $teamId}}}) {
    user_id
  }
}`;

const getTeamMembers = `query getTeamMembers($teamId: Int, $userId: Int) {
  team_members(where: { _and: { team_id: { _eq: $teamId }, user_id: { _neq: $userId }}}) {
    user_id
  }
}`;

module.exports = {
  checkIfMember,
  getTeamMembers,
};
