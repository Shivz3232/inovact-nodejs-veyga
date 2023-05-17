const add_TeamDocument = `mutation add_TeamDocument($name: String!, $team_id:Int ,$mime_type: String!,$url: String! ) {
  insert_team_documents(objects: [{
    team_id: $team_id,
    mime_type: $mime_type,
    url: $url,
    name: $name
	
  }]) {
    returning {
      id
      mime_type
      url
      uploaded_at
      
    }
  }
}`;



module.exports = {
 add_TeamDocument
  
};
