const blockUserMutation = `mutation blockUser($userId: Int!, $blockedUserId: Int!, $reason: String) {
  insert_user_blocked_users_one(object: {
    user_id: $userId,
    blocked_user_id: $blockedUserId,
    reason: $reason
  }) {
    id
    user_id
    blocked_user_id
    reason
    created_at
  }
}`;

module.exports = { blockUserMutation };