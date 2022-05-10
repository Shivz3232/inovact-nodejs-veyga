const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
    user(where: { cognito_sub: $cognito_sub }) {
      id
    }
  }
  `;

const checkValidRequest = `query checkValidRequest($user1: Int, $user2: Int) {
    user(where: {id: {_eq: $user2}}) {
      id
    }
    connections(where: { _or: [
      {
        _and: [{user1: { _eq: $user1 }}, {user2: { _eq: $user2 }}]
      },
      {
        _and: [{user1: { _eq: $user2 }}, {user2: { _eq: $user1 }}]
      }
    ]}) {
      status
    }
  }`;

module.exports = {
    checkValidRequest,
    getUserId,
};
