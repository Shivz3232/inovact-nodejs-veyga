const getUser = `query GetUserById($userId: Int!) {
  user(where: { id: { _eq: $userId } }) {
    first_name
  }
}
`;

const getFcmToken = `query getFcmToken($userId: [Int!]) {
  user(where: { id: { _in: $userId } }) {
  fcm_token
  }
}`;

module.exports = {
  getUser,
  getFcmToken,
};
