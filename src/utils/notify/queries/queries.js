/* eslint-disable */

const getUser = `query getUser($cognito_sub: String_comparison_exp) { user (where: { cognito_sub: $cognito_sub }) { first_name }}`;

module.exports = {
  getUser,
};
