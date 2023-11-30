const addTeamDocument = `mutation addTeamDocument($fileName: String!, $teamId:Int, $mimeType: String!, $url: String! ) {
  insert_team_documents(objects: [{
    team_id: $teamId,
    mime_type: $mimeType,
    url: $url,
    name: $fileName
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
  addTeamDocument,
};
