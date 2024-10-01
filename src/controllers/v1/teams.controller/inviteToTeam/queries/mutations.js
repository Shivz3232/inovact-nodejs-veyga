const addTeamInvite = `mutation addTeamInvite($team_id: Int, $user_id: Int) {
  insert_team_invitations(objects: [{ team_id: $team_id, user_id: $user_id}]) {
    affected_rows
  }
}`;

module.exports = {
  addTeamInvite,
};
