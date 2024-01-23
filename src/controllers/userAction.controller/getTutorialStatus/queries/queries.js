const fetchTutorialStatus = `query getUserActionDetails($cognitoSub: String) {
  user_actions(where: { user: { cognito_sub: { _eq: $cognitoSub } } }) {
    user_id
    feed_tutorial
    profile_tutorial
    team_tutorial
  }
}
`;

module.exports = { fetchTutorialStatus };
