const deletequery = `
mutation delete_project($id: Int!) {
  delete_project_by_pk(id: $id) {
    id
  }
}
`;

module.exports = {
  deletequery,
};
