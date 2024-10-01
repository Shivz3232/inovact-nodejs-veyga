const toggleStatus = `mutation toggleStatus($cognito_sub : String , $status : Int!){
    update_user(where : {cognito_sub : {_eq : $cognito_sub}} , _set : {status :  $status}){
        returning{
          status
        }

    }
}`;

const addUserCause = `mutation addUserCause($user_id : Int , $cause : String! , $action : String!){
  insert_user_causes(objects: [{user_id: $user_id, cause: $cause , action : $action}]){
      returning{
          id
      }
  }
}`;

module.exports = {
  toggleStatus,
  addUserCause,
};
