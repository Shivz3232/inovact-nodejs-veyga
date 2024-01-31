const insertUserActivityQuery = `mutation addUserActivity($userId: Int, $direction: user_activities_direction_enum_enum, $activityId: uuid, $status: user_activities_status_enum_enum) {
  insert_user_activities_one(object: {
    user_id: $userId,
    direction: $direction,
    activity_id: $activityId,
    status: $status
  }) {
    id
    user_id
    direction
    activity_id
    status
    created_at
    updated_at
  }
}`;

module.exports = { insertUserActivityQuery };
