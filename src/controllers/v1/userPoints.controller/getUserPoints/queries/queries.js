const getUserPointsQuery = `query ($cognitoSub: String!) {
    user_points(where: { user: { cognito_sub: { _eq: $cognitoSub } } }) {
      id
      user_id
      points
      created_at
      updated_at
    }
}`;

module.exports = {getUserPointsQuery};
