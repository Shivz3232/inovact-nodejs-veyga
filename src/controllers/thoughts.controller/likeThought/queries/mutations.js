const add_likeThought = `mutation add_likeThought( $user_id: Int,$thought_id: Int) {


 insert_thought_likes(objects: [{ user_id: $user_id,thought_id: $thought_id}]) {
 
 returning{
     user_id
 }
 
 }

}
`;

const delete_like = `mutation delete_like($user_id: Int,$thought_id: Int) {
delete_thought_likes(
where: {user_id: {_eq: $user_id}, thought_id:{_eq:$thought_id}}
) {
affected_rows
}
}`;

module.exports = {
  add_likeThought,
  delete_like,
};
