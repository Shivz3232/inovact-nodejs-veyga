const getUserIdQuery = `query getUserId($cognitoSub: String!) {
    user(where: { cognito_sub: { _eq: $cognitoSub } }) {
        id
    }
}`;

module.exports = { getUserIdQuery };
