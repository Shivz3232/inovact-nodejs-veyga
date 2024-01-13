const fetchTutorialStatus = `query getUserActionDetails($cognitoSub: String) {
  user_actions(where: { user: { cognito_sub: { _eq: $cognitoSub } } }) {
    user_id
    tutorial_complete
  }
}
`;

module.exports = { fetchTutorialStatus };
