const possibleToJoinTeam = `query joinTeam($team_id: Int, $cognito_sub: String, $role_requirement_id: Int) {
  team(where: {id: {_eq: $team_id}}) {
    looking_for_members
    looking_for_mentors
    creator: user {
      role
    }
	}
  team_members(where: { team_id: {_eq: $team_id}, user: {cognito_sub: {_eq: $cognito_sub}}}) {
    team_id
    user_id
  }
  team_invitations(where: {team_id: {_eq: $team_id},  user: {cognito_sub: {_eq: $cognito_sub}}}) {
    id
  }
  team_requests(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team_id: {_eq: $team_id}, role_requirement_id: {_eq: $role_requirement_id}}) {
    id
  }
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
    role
  }
  notifier_ids: team_members(where: {team_id: {_eq: $team_id}, admin: {_eq: true}}) {
    user_id
  }
}`;

module.exports = {
  possibleToJoinTeam,
};
