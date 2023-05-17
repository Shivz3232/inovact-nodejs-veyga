  const updateThought_query = `
    mutation updateIdea($id: Int_comparison_exp, $changes: thoughts_set_input) {
      update_thoughts(where: { id: $id }, _set: $changes) {
        returning {
          id
        }
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
  updateThought_query,
  getUserId,
  getThoughtUserId
}