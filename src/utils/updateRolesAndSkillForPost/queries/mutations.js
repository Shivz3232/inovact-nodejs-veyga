const deleteTeamMembers = `mutation deleteTeamMembers($memberIds: [Int!]!) {
  delete_team_members(where: {id: {_in: $memberIds}}) {
    affected_rows
  }
}`;

const deleteRoleSkills = `mutation deleteRoleSkills($roleIds: [Int!]!) {
  delete_team_skill_requirements(where: {role_requirement_id: {_in: $roleIds}}) {
    affected_rows
  }
}`;

const deleteRoles = `mutation deleteRoles($roleIds: [Int!]!) {
  delete_team_role_requirements(where: {id: {_in: $roleIds}}) {
    affected_rows
  }
}`;

const addSkillsRequired = `mutation addSkillRequired($objects: [team_skill_requirements_insert_input!]!) {
  insert_team_skill_requirements(objects: $objects) {
    affected_rows
  }
}`;

const addRolesRequired = `mutation addRolesRequired($objects: [team_role_requirements_insert_input!]!) {
  insert_team_role_requirements(objects: $objects) {
    returning {
      id
    }
  }
}`;

module.exports = {
  deleteTeamMembers,
  deleteRoleSkills,
  deleteRoles,
  addSkillsRequired,
  addRolesRequired,
};
