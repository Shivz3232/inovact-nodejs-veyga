const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
    user(where: { cognito_sub: $cognito_sub }) {
      id
    }
  }
  `;

const getPendingConnection = `query getConnection($user1: Int, $user2: Int) {
    connections(where: { 
       _and: [{user1: { _eq: $user1 }}, {user2: { _eq: $user2 }}] ,
      status: { _eq: "pending"}}) {
      user1
      user2
      status
    }
  }`;

const deleteConnection = `mutation rejectConnection($user1: Int, $user2: Int) {
    delete_connections(where: {_or: [{_and: [{user1: {_eq: $user1}}, {user2: {_eq: $user2}}]}, {_and: [{user1: {_eq: $user2}}, {user2: {_eq: $user1}}]}], status: {_eq: "pending"}}) {
      returning {
        status
      }
    }
  }
  `;

module.exports = {
  getPendingConnection,
  deleteConnection,
  getUserId,
};
