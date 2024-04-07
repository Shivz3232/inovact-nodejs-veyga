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

module.exports = {
  getUserId,
  delete_idea,
};
