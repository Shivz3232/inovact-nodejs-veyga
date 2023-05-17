const deletequery = `
mutation delete_project($id: Int!) {
  delete_team(where :{projects : {id : {_eq :$id}}}){
    affected_rows
  }
  delete_project_by_pk(id: $id) {
    id
  }
}
`;

module.exports = {
  deletequery,
};
