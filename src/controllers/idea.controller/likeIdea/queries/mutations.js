
const add_likeIdea = `mutation add_likeIdea( $user_id: Int,$idea_id: Int) {


    insert_idea_like(objects: [{ user_id: $user_id,idea_id: $idea_id}]) {
    
    returning{
        user_id
    }
    
    }
   
   }
   `;
   const delete_like=`mutation delete_like($user_id: Int,$idea_id: Int) {
   delete_idea_like(
   where: {user_id: {_eq: $user_id}, idea_id:{_eq:$idea_id}}
   ) {
   affected_rows
   }
   }`;
   
   module.exports = {
     add_likeIdea,
     delete_like
   };