const checkTeamAdmin = `query checkTeamAdmin($user_id: Int, $team_id: Int) {
  team_members(where: {user_id: {_eq: $user_id}, team_id: {_eq: $team_id}}) {
    admin
  }
}`;

const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

module.exports = {
  checkTeamAdmin,
  getUserId,
};
