const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const UpdateUserFCMToken = `mutation UpdateUserFCMToken($userId: Int!, $fcmToken: String!) {
  update_user_by_pk(pk_columns: {id: $userId}, _set: {fcm_token: $fcmToken}) {
    id
    fcm_token
  }
}
`;

module.exports = {
  getUserId,
  UpdateUserFCMToken,
};
