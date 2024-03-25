const delete_idea = `
mutation delete_idea($id: Int!) {
  delete_team(where :{ideas : {id : {_eq :$id}}}){
    affected_rows
  }
  delete_idea_by_pk(id: $id) {
    id
    user_id
  }
}
`;

module.exports = {
  delete_idea,
};
