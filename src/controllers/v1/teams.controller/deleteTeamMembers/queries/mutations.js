const deleteTeamMember = `mutation deleteTeamMember($user_id: Int, $team_id: Int) {
  delete_team_members(where: {team_id: {_eq: $team_id}, user_id: {_eq: $user_id}}) {
    affected_rows
  }
}
`;

module.exports = {
  deleteTeamMember,
};
