
const add_likePost = `mutation add_likePost( $user_id: Int,$project_id: Int) {


 insert_project_like(objects: [{ user_id: $user_id,project_id: $project_id}]) {
 
 returning{
     user_id
 }
 
 }

}
`;

const delete_like=`mutation delete_like($user_id: Int,$project_id: Int) {
delete_project_like(
where: {user_id: {_eq: $user_id}, project_id:{_eq:$project_id}}
) {
affected_rows
}
}`;

module.exports = {
  add_likePost,
  delete_like
};