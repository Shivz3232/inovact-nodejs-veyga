const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const getideaId = `query  getIdeaLike($idea_id: Int, $user_id: Int) {
  idea_like(where: {_and: [{idea_id: {_eq: $idea_id}}, {user_id: {_eq: $user_id}}]}) {
    idea_id
    user_id
  }
  idea(where: {id: {_eq: $idea_id}}) {
    user_id
  }
}
`;
module.exports = {
  getUserId,
  getideaId,
};
