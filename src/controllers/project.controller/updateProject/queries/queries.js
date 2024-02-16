const getUserIdFromCognito = `query getUserIdFromCognito($cognito_sub: String) {
    user(where: {cognito_sub: {_eq: $cognito_sub}}) {
      id
    }
  }`;

module.exports = {
  getUserIdFromCognito,
};
