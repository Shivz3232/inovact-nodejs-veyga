const acceptInvite = `mutation acceptInvite($team_id: Int, $user_id: Int, $invitation_id: Int) {
  delete_team_invitations(where: {id: {_eq: $invitation_id}}) {
    affected_rows
  }
  insert_team_members(objects: [{
    team_id: $team_id,
    user_id: $user_id
  }]) {
    affected_rows
  }
}`;

module.exports = {
  acceptInvite,
};
