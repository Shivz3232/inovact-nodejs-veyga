const getUserActivitiesQuery = `query getUserActivities($cognitoSub: String) {
  user_activities(where: { user:{
    cognito_sub:{
      _eq: $cognitoSub
    }
  } }, order_by:{
    updated_at:desc, created_at:desc
  }) {
    id
    user_id
    direction
    activity_id
    status
    created_at
    updated_at
    activity{
      title
      description
      points
      entity_type
      identifier
    }
    user_activity_entities{
      entity_id
    }
  }
}
`;

module.exports = { getUserActivitiesQuery };
