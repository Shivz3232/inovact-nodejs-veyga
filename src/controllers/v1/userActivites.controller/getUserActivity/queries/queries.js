const getUserActivityQuery = `query getUserActivity($activityId: uuid) {
  user_activities(where: { id:{
     _eq: $activityId
  } }) {
    id
    user_id
    direction
    activity_id
    status
    created_at
    updated_at
  }
}
`;

module.exports = { getUserActivityQuery };
