const delete_idea = `
mutation delete_idea($id: Int!) {
  delete_idea_by_pk(id: $id) {
    id
  }
}
`;

module.exports = {
  delete_idea,
};
