const getDocumentKey = `query getDocumentKey($cognitoSub: String, $documentId: Int) {
  team_documents(where: {id: {_eq: $documentId}, team: {user: {cognito_sub: {_eq: $cognitoSub}}}}) {
    url
  }
}`;

module.exports = {
  getDocumentKey,
};
