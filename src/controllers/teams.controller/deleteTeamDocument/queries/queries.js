const getTeamDocumentQuery = `query getTeamDocument($id: Int!){
  team_documents_by_pk(id: $id) {
    team_id
    name
    url
    mime_type
    uploaded_at
  }
}
`;

const checkIfMemberQuery = `query checkIfMember($cognitoSub: String, $teamId: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognitoSub}}, team: {id: {_eq: $teamId}}}) {
    user_id
  }
}`;

const deleteTeamDocumentQuery = `mutation deleteDocument($id: Int!) {
  delete_team_documents_by_pk(id: $id) {
    id
  }
}
`;

module.exports = {
  getTeamDocumentQuery,
  checkIfMemberQuery,
  deleteTeamDocumentQuery,
};
