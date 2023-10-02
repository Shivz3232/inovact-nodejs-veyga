const updatePost = `
mutation updateProject($id: Int_comparison_exp, $changes: project_set_input) {
  update_project(where: { id: $id }, _set: $changes) {
    returning {
      id,
      team_id,
      user_id
    }
  }
}
`;

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

const deleteTeam = `mutation deleteTeam($team_id: Int) {
  delete_team(where: { id: { _eq: $team_id } }) {
    affected_rows
  }
}
`;

module.exports = {
  updatePost,
  updateRolesRequired,
  updateProjectFlags,
  updateDocuments,
  updateProjectTags,
  updateMentions,
  deleteTeam,
};
