const updateTutorialStatusQuery = `mutation updateTutorialStatusQuery($cognitoSub: String, $tutorialComplete: Boolean) {
  update_user_actions(where: { user: { cognito_sub: { _eq: $cognitoSub } } }, _set: { tutorial_complete: $tutorialComplete }) {
    returning {
      user_id
      tutorial_complete
    }
  }
}
`;

module.exports = { updateTutorialStatusQuery };