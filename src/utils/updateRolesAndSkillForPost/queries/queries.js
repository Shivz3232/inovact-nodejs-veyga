const getRoleRequirements = `query getRoleRequirements($team_id: Int!) {
  team_role_requirements(where: {team_id: {_eq: $team_id}}) {
    id
    role_name
    team_id
    team{
        team_members {
        user_id
        role_requirement_id
        }
    }
    team_skill_requirements {
      id
      skill_name
    }
  }
}`;

module.exports = {
  getRoleRequirements,
};
