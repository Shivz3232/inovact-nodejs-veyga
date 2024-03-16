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
  query getRefferralDetails($cognitoSub: String, $emailId: String) {
    existingReferral: referrals(
      where: {
        user: {
          cognito_sub: { _eq: $cognitoSub }
        }
      }
    ) {
      id
      user {
        id
      }
    }
    userReferred: referrals(
      where: {
        _and: [
          { user:{
            cognito_sub: {
              _eq:$cognitoSub
            }
          } }
          { userByUserId:{
            email_id:{
              _eq:$emailId
            }
          } }
        ]
      }
    ) {
      id
    }
  }
`;

module.exports = {
  getUserDetails,
  getRefferralDetails,
};
