const updateUserActions = `mutation UpdateUserAction($cognitoSub: String, $data: user_actions_set_input!) {
    update_user_actions(_set: $data, where: { user: { cognito_sub:{
      _eq:$cognitoSub
    } } }) {
      returning {
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
        id
        last_app_opened_timestamp
      }
    }
  }`;

module.exports = { updateUserActions };
