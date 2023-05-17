const acceptJoinRequest1 = `mutation acceptJoinRequest1($user_id: Int, $team_id: Int, $request_id: Int, $role: String, $role_requirement_id: Int) {
  delete_team_requests(where: {id: {_eq: $request_id}}) {
    affected_rows
  }
  insert_team_members(objects: [{
    user_id: $user_id,
    team_id: $team_id,
    role: $role
  }]) {
    affected_rows
  }
  delete_team_role_requirements(where: {id: {_eq: $role_requirement_id}}) {
    affected_rows
  }
}`;

const acceptJoinRequest2 = `mutation acceptJoinRequest2($user_id: Int, $team_id: Int, $request_id: Int, $role: String) {
  delete_team_requests(where: {id: {_eq: $request_id}}) {
    affected_rows
  }
  insert_team_members(objects: [{
    user_id: $user_id,
    team_id: $team_id,
    role: $role
  }]) {
    affected_rows
  }
}`;

module.exports = {
  acceptJoinRequest1,
  acceptJoinRequest2,
};
