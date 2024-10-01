const getUsersFromEmailId = `
query getUsersFromEmailId($emails: [String!]) {
  user(where: {email_id: {_in: $emails}}) {
    id
    email_id
  }
}
`;

const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

module.exports = {
  getUsersFromEmailId,
  getUserId,
};
