const possibleToInviteUser = `query possibleToInviteUser($team_id: Int, $user_id: Int, $cognito_sub: String){
  team_invitations(where: {team_id: {_eq: $team_id}, user_id: {_eq: $user_id}}) {
    id
  }
  team_members(where: { team_id: {_eq: $team_id}, user_id: { _eq: $user_id }}) {
    team_id
    user_id
  }
  current_user: team_members(where: { team_id: {_eq: $team_id}, user: { cognito_sub: {_eq: $cognito_sub}}}) {
    admin
  }
  team_requests(where: { team_id: {_eq: $team_id}, user_id: {_eq: $user_id}}) {
    id
  }
}`;

module.exports = {
  possibleToInviteUser,
};
