const getToken = `query GetToken($cognito_sub: String!, $token: String!, $now: timestamptz!) {
  phone_number_verification_tokens(where: {user: {cognito_sub: {_eq: $cognito_sub}}, expires_at: {_gt: $now}, token: {_eq: $token}}) {
    phone_number
  }
}`;

module.exports = {
  getToken,
};
