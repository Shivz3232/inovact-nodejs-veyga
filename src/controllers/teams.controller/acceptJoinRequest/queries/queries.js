const checkIfPossibleToAccept = `query checkIfPossibleToAccept($cognito_sub: String, $request_id: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team: {team_requests: {id: {_eq: $request_id}}}}) {
    user_id
    admin
  }
  team_requests(where:  {id: {_eq: $request_id}}) {
    team_id
    user_id
    role_requirement_id
  }
}`;

const getRoleRequirement = `query roleRequirement($roleRequirementId: Int) {
  team_role_requirements(where: { id: { _eq: $roleRequirementId }}) {
    role_name
  }
}`;

const getTeamJoinedCount = `query getTeamJoinedCount($userId:Int){
  team_members(where:{
    _and:{
    user_id:{
      _eq:$userId
    },
    team:{
      creator_id:{
        _neq: $userId
      }
    }
  }
  }){
    team_id
    user_id
    team{
      ideas{id}
      projects{id}
    }
    
  }
}`;

module.exports = {
  checkIfPossibleToAccept,
  getRoleRequirement,
  getTeamJoinedCount,
};
