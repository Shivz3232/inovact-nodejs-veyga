const getFcmToken = `query getFcmToken($userId: [Int!]) {
  user(where: { id: { _in: $userId } }) {
  fcm_token
  }
}
`;

module.exports = {
  getFcmToken,
};
