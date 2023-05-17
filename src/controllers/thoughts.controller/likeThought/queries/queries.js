const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const getThoughtId = `query  getThoughtLike($thought_id: Int, $user_id: Int) {
  thought_likes(where: {_and: [{thought_id: {_eq: $thought_id}}, {user_id: {_eq: $user_id}}]}) {
    thought_id
    user_id
  }
  thoughts(where: {id: {_eq: $thought_id}}) {
    user_id
  }
}
`;

module.exports = {
  getThoughtId,
  getUserId,
};
