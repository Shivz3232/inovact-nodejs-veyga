const delete_thought = `
      mutation delete_thoughts($id: Int!) {
        delete_thoughts_by_pk(id: $id) {
          id
        }
      }
    `;

const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const getThoughtUserId = `query getThought($id: Int) {
    thoughts (where: { id: { _eq: $id }}) {
      id
      user_id
     

    }
  }
  `;

module.exports = {
  delete_thought,
  getUserId,
  getThoughtUserId,
};
