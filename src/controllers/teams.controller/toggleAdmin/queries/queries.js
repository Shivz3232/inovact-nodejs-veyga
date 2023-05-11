const checkIfCanMakeAdmin = `query checkIfCanMakeAdmin($user_id: Int, $team_id: Int, $cognito_sub: String) {
  members: team_members(where: {team_id: {_eq: $team_id}, user_id: {_eq: $user_id}}) {
    user_id
    admin
  }
  admins: team_members(where: {team_id: {_eq: $team_id}, user: {cognito_sub: {_eq: $cognito_sub}}, admin: {_eq: true}}) {
    user_id
  }
}`;

module.exports = {
  checkIfCanMakeAdmin,
};
