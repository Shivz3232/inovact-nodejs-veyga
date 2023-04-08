const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const getPostId = `query  getPostLike($project_id: Int, $user_id: Int) {
  project_like(where: {_and: [{project_id: {_eq: $project_id}}, {user_id: {_eq: $user_id}}]}) {
    project_id
    user_id
    project {
      user_id
    }
  }
  project(where: {id: {_eq: $project_id}}) {
    user_id
  }
}
`;

module.exports = {
  getPostId,
  getUserId,
};
