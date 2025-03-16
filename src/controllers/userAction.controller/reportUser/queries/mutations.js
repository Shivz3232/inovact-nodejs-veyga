const reportUserMutation = `mutation reportUser($userId: Int!, $reportedBy: Int!, $reason: String!) {
  insert_user_reports_one(object: {
    user_id: $userId,
    reported_by: $reportedBy,
    reason: $reason
  }) {
    id
    user_id
    reported_by
    reason
    created_at
  }
}`;

module.exports = { reportUserMutation };
