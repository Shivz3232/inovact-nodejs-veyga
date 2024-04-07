const getUserActionDetails = `query getUserActionDetails($cognitoSub: String) {
  user_actions(where: { user: { cognito_sub: { _eq: $cognitoSub } } }) {
        id
        user_id
        team_tutorial_complete
        feed_tutorial_complete
        profile_tutorial_complete
        has_uploaded_project
        has_uploaded_idea
        has_uploaded_thought
        has_sought_team
        has_sought_mentor
        has_sought_team_and_mentor
        last_app_opened_timestamp
  }
}
`;

module.exports = { getUserActionDetails };
