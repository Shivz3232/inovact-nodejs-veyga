const getUserIds = `query getUserIds($cognito_sub: String!, $reported_user_id: Int!) {
  reporter: user(where: { cognito_sub: { _eq: $cognito_sub } }) {
    id
  }
  reported: user(where: { id: { _eq: $reported_user_id } }) {
    id
  }
}`;

module.exports = { getUserIds };
