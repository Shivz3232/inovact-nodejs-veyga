const deleteTeam = `mutation deleteTeam($team_id: Int) {
  delete_team(where: {id: {_eq: $team_id}}) {
    affected_rows
  }
}`;

module.exports = {
  deleteTeam,
};
