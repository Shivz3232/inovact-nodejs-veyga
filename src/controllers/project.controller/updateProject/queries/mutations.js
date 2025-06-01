const updatePost = `mutation updateProject($cognito_sub: String!, $id: Int!, $changes: project_set_input) {
  update_project(where: {id: {_eq: $id}, user: {cognito_sub: {_eq: $cognito_sub}}}, _set: $changes) {
    returning {
      id
      team_id
      user_id
      team {
        looking_for_members
        looking_for_mentors
      }
    }
  }
}`;

const UpdateProjectTeam = `mutation UpdateProjectTeam($projectId: Int!, $newTeamId: Int!) {
  update_project_by_pk(
    pk_columns: { id: $projectId }
    _set: { team_id: $newTeamId }
  ) {
    id
    team_id
  }
}`;

const updateRolesRequired = `mutation updateRolesRequired($teamId: Int, $newRoles: [team_role_requirements_insert_input!]!) {
  delete_team_role_requirements(where: { team_id: { _eq: $teamId } }) {    returning {
      id
    }}
  insert_team_role_requirements(objects: $newRoles) {
    returning {
      id
    }
  }
}
`;

const updateProjectFlags = `mutation updateProjectFlags($team_id: Int, $lookingForMentors: Boolean, $lookingForMembers: Boolean) {
  update_team(
    where: { id: { _eq: $team_id } }
    _set: { looking_for_mentors: $lookingForMentors, looking_for_members: $lookingForMembers }
  ) {
    returning {
      id
    }
  }
}`;

const updateDocuments = `mutation updateDocuments($project_id: Int, $documents: [project_documents_insert_input!]!) {
  delete_project_documents(where: {project_id: {_eq: $project_id}}) {
    returning {
      id
    }
  }
  insert_project_documents(objects: $documents) {
    affected_rows
  }
}
`;

const updateProjectTags = `mutation updateProjectTags($projectId: Int, $tags: [project_tag_insert_input!]!) {
  delete_project_tag(where: { project_id: { _eq: $projectId } }){
        affected_rows
  }
  insert_project_tag(objects: $tags) {
    affected_rows
  }
}`;

const updateMentions = `mutation updateMentions($projectId: Int, $mentions: [project_mentions_insert_input!]!) {
  delete_project_mentions(where: { project_id: { _eq: $projectId } })
  insert_project_mentions(objects: $mentions) {
    affected_rows
  }
}`;

const deleteTeam = `mutation deleteTeam($team_id: Int) {
  delete_team(where: { id: { _eq: $team_id } }) {
    affected_rows
  }
}
`;

const addRolesRequired = `mutation addRolesRequired($objects: [team_role_requirements_insert_input!]!) {
  insert_team_role_requirements(objects: $objects) {
    returning {
      id
    }
  }
}`;

const addSkillsRequired = `mutation addSkillRequired($objects: [team_skill_requirements_insert_input!]!) {
  insert_team_skill_requirements(objects: $objects) {
    affected_rows
  }
}`;

const updateLookingForTeamMembersAndMentors = `mutation updateLookingForTeamMembersAndMentors($teamId:Int, $looking_for_members:Boolean
, $looking_for_mentors:Boolean){
  update_team(where: {id: {_eq: $teamId}}, _set: {looking_for_members: $looking_for_members, looking_for_mentors: $looking_for_mentors}) {
    returning {
      id
      looking_for_members
      looking_for_mentors
      name
      avatar
      chat_id
      creator_id
    }
  }
}
`;

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

const updateRoleRequirement = `mutation updateRoleRequirement($roleId: Int!, $roleName: String!) {
  update_team_role_requirements_by_pk(
    pk_columns: {id: $roleId}, 
    _set: {role_name: $roleName}
  ) {
    id
    role_name
  }
}`;

module.exports = {
  updatePost,
  updateRolesRequired,
  updateProjectFlags,
  UpdateProjectTeam,
  updateDocuments,
  updateProjectTags,
  updateMentions,
  addRolesRequired,
  addSkillsRequired,
  deleteTeam,
  updateLookingForTeamMembersAndMentors,
  deleteTeamMembers,
  deleteRoleSkills,
  deleteRoles,
  updateRoleRequirement,
};
