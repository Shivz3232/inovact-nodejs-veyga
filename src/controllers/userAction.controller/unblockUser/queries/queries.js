const getUserIds = `query getUserIds($cognito_sub: String!, $blocked_user_id: Int!) {
  blocker: user(where: { cognito_sub: { _eq: $cognito_sub } }) {
    id
  }
  blocked: user(where: { id: { _eq: $blocked_user_id } }) {
    id
  }
}`;

const checkBlockExists = `query checkBlockExists($userId: Int!, $blockedUserId: Int!) {
  user_blocked_users(where: {
    user_id: {_eq: $userId},
    blocked_user_id: {_eq: $blockedUserId}
  }) {
    id
  }
}`;

module.exports = { getUserIds, checkBlockExists };