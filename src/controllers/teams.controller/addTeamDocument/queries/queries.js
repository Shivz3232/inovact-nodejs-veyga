const checkIfAdmin = `query checkIfAdmin($cognito_sub: String, $team_id: Int) {
  current_user: team_members(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team: {id: {_eq: $team_id}}}) {
    user_id
    admin
  }
  team_members(where: {team_id: {_eq: $team_id}}) {
    user_id
  }
}`;

module.exports = {
  checkIfAdmin,
};
