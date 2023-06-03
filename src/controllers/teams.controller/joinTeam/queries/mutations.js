const addTeamRequestByStudent = `mutation addTeamRequestByStudent($user_id: Int, $roleRequirementId: Int, $team_id: Int) {
  insert_team_requests(objects: [{ user_id: $user_id, team_id: $team_id, role_requirement_id: $roleRequirementId }]) {
    affected_rows
  }
}`;

const addTeamRequestByMentor = `mutation addTeamRequestByMentor($team_id: Int, $user_id: Int , $roleRequirementId: Int) {
	insert_team_requests(objects: [{
    team_id: $team_id,
    user_id : $user_id
    , role_requirement_id: $roleRequirementId 
  }]) {
    affected_rows
  }
}
`;

const addTeamRequestByEntrepreneurAsMember = `mutation addTeamRequestByEntrepreneurAsMember($user_id: Int, $roleRequirementId: Int, $team_id: Int) {
  insert_team_requests(objects: [{ user_id: $user_id, team_id: $team_id, role_requirement_id: $roleRequirementId }]) {
    affected_rows
  }
}`;

const addTeamRequestByEntrepreneurAsMentor = `mutation addTeamRequestByEntrepreneurAsMentor($team_id: Int, $user_id: Int) {
	insert_team_requests(objects: [{
    team_id: $team_id,
    user_id: $user_id
  }]) {
    affected_rows
  }
}
`;

module.exports = {
  addTeamRequestByStudent,
  addTeamRequestByMentor,
  addTeamRequestByEntrepreneurAsMember,
  addTeamRequestByEntrepreneurAsMentor,
};
