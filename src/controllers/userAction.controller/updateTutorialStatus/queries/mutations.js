const updateTutorialStatusQuery = `mutation updateTutorialStatusQuery($cognito_sub: String, $_set: user_actions_set_input!) {
  update_user_actions(where: { user: { cognito_sub: { _eq: $cognito_sub } } }, _set: $_set) {
    affected_rows
    returning {
      user_id
      feed_tutorial_complete
      profile_tutorial_complete
      team_tutorial_complete
    }
  }
}`;

module.exports = { updateTutorialStatusQuery };
