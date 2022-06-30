const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
    user(where: { cognito_sub: $cognito_sub }) {
      id
    }
  }
  `;

const getPendingConnection = `query getConnection($user1: Int, $user2: Int) {
    connections(where: { _and: [{user1: { _eq: $user1 }}, {user2: { _eq: $user2 }}], status: { _eq: "pending"}}) {
      id
      user1
      user2
      status
    }
  }
  `;

module.exports = {
  getPendingConnection,
  getUserId,
};
