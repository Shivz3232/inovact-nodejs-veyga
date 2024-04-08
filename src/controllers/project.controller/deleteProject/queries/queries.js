const deletequery = `
mutation delete_project($id: Int!) {
  delete_team(where :{projects : {id : {_eq :$id}}}){
    affected_rows
  }
  delete_project_by_pk(id: $id) {
    id
    user_id
  }
}
`;

const checkIfCanDelete = `
query checkIfCanDelete($id: Int, $cognito_sub: String) {
  project(where: {id: {_eq: $id}, user: {cognito_sub: {_eq: $cognito_sub}}}) {
    id
  }
}
`;

module.exports = {
  deletequery,
  checkIfCanDelete,
};
