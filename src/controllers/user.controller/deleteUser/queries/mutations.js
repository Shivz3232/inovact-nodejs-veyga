const addUserCause = `mutation addUserCause($user_id : Int , $cause : String! , $action : String!){
    insert_user_causes(objects: [{user_id: $user_id, cause: $cause , action : $action}]){
        returning{
            id
        }
    }
}`;

const deleteUser = `mutation deleteUser($user_id: Int!) {
    delete_user_by_pk( id: $user_id ){
        id
    }
}`;

module.exports = {
  addUserCause,
  deleteUser,
};
