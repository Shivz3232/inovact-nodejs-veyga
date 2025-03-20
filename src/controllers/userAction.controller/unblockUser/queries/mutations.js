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

const unblockUserMutation = `mutation unblockUser($userId: Int!, $blockedUserId: Int!) {
  delete_user_blocked_users(where: {
    user_id: {_eq: $userId}, 
    blocked_user_id: {_eq: $blockedUserId}
  }) {
    affected_rows
  }
}`;

module.exports = { blockUserMutation, unblockUserMutation };