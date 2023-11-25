const deleteUserSkill = `  mutation deleteUserSkill($id: Int!, $cognito_sub: String) {
    delete_user_skills(where: { id: { _eq: $id }, user : {
      cognito_sub:{_eq:$cognito_sub}
    } }) {
      affected_rows
    }
  }`;

module.exports = {
  deleteUserSkill,
};
