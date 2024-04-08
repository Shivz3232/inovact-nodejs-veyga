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

const getUserId = `query getUserId($cognitoSub:String){
  user(where :{
    cognito_sub: {
      _eq : $cognitoSub
    }
  }){
    id
  }
}`;


const checkIfCanDelete = `
query checkIfCanDelete($id: Int, $cognito_sub: String) {
  idea(where: {id: {_eq: $id}, user: {cognito_sub: {_eq: $cognito_sub}}}) {
    id
  }
}
`;

module.exports = {
  getUserId,
  delete_idea,
  checkIfCanDelete,
};
