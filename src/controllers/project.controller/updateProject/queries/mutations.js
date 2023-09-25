const updatePost_query = `
mutation updateProject($id: Int_comparison_exp, $changes: project_set_input) {
  update_project(where: { id: $id }, _set: $changes) {
    returning {
      id
    }
  }
}
`;

const updateRolesRequired = `mutation updateRolesRequired($projectId: Int, $newRoles: [team_role_requirements_insert_input!]!) {
  delete_team_role_requirements(where: { project_id: { _eq: $projectId } })
  insert_team_role_requirements(objects: $newRoles) {
    returning {
      id
    }
  }
}`;

const updateProjectFlags = `mutation updateProjectFlags($projectId: Int, $lookingForMentors: Boolean, $lookingForMembers: Boolean) {
  update_project(
    where: { id: { _eq: $projectId } }
    _set: { looking_for_mentors: $lookingForMentors, looking_for_members: $lookingForMembers }
  ) {
    returning {
      id
    }
  }
}`;

const updateDocuments = `mutation updateDocuments($projectId: Int, $documents: [project_documents_insert_input!]!) {
  delete_project_documents(where: { project_id: { _eq: $projectId } })
  insert_project_documents(objects: $documents) {
    affected_rows
  }
}`;

const updateProjectTags = `mutation updateProjectTags($projectId: Int, $tags: [project_tag_insert_input!]!) {
  delete_project_tag(where: { project_id: { _eq: $projectId } })
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

const deleteTeam = `mutation deleteTeam($projectId: Int) {
  delete_team(where: { id: { _eq: $projectId } }) {
    affected_rows
  }
}
`;

module.exports = {
  updatePost_query,
  updateRolesRequired,
  updateProjectFlags,
  updateDocuments,
  updateProjectTags,
  updateMentions,
  deleteTeam,
};
