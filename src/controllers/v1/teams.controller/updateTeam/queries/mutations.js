const updateTeam = `mutation updateTeam($team_id: Int, $updates: team_set_input) {
  update_team(where: {id: {_eq: $team_id}}, _set: $updates) {
    affected_rows
  }
}
`;

module.exports = {
  updateTeam,
};
