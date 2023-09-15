const getUser = `query GetUserById($userId: Int!) {
  user(where: { id: { _eq: $userId } }) {
    first_name
  }
}
`;

module.exports = {
  getUser,
};
