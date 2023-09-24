const updatePost_query = `
mutation updateProject($id: Int_comparison_exp, $changes: project_set_input) {
  update_project(where: { id: $id }, _set: $changes) {
    returning {
      id,
      team_id
    }
  }
}
`;

const UpdateRolesRequired = `mutation UpdateRolesRequired($teamId: Int!, $changes: project_set_input) {
  team(where: {id: {_eq:teamId }}, _set: $changes){
    returning {
      id
    }
  }
}
`;

module.exports = {
  updatePost_query,
  UpdateRolesRequired,
};
