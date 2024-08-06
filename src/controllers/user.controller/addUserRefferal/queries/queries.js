const getUserDetails = `query getUserDetails($emailId: String, $cognitoSub: String!) {
    userWithEmail: user(where: { email_id: { _eq: $emailId } }) {
        id
        email_id
  }
    userWithCognitoSub: user(where: { cognito_sub: { _eq: $cognitoSub } }) {
        id
        email_id
        cognito_sub
  }
}
`;

const getRefferralDetails = `
  query getRefferralDetails($cognitoSub: String) {
    existingReferral: referrals(
      where: {
        userByUserId: {
          cognito_sub: { _eq: $cognitoSub }
        }
      }
    ) {
      id
      user {
        id
      }
    }
  }
`;

module.exports = {
  getUserDetails,
  getRefferralDetails,
};
