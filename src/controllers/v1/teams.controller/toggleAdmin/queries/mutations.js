const makeAdmin = `mutation makeAdmin($user_id: Int, $team_id: Int) {
	update_team_members(where: {team_id: {_eq: $team_id}, user_id: {_eq: $user_id}}, _set: {admin: true}) {
    affected_rows
  }
}`;

module.exports = {
  makeAdmin,
};
