const updatePost_query = `
mutation updateProject($id: Int_comparison_exp, $changes: project_set_input) {
  update_project(where: { id: $id }, _set: $changes) {
    returning {
      id
    }
  }
}
`;

module.exports = {
  updatePost_query,
};
