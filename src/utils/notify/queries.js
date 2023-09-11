const getFcmToken = `query getFcmToken($userId: Int!) {
  user(where: { id: { _eq: $userId } }) {
  fcm_token
  }
}
`;

module.exports = {
  getFcmToken,
};
