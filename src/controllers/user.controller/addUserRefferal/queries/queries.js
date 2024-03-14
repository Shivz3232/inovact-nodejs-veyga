const getUserDetails = `query getUserDetails($emailId: String, $cognitoSub: String!) {
    userWithEmail: user(where: { email_id: { _eq: $emailId } }) {
        id
        email_id
  }
    userWithCognitoSub: user(where: { cognito_sub: { _eq: $cognitoSub } }) {
        id
        cognito_sub
  }
}
`;

const checkIfReferalExists = `query checkIfReferralExists($cognitoSub: String) {
  referrals(
    where: {user:{
      cognito_sub:{
        _eq: $cognitoSub
      }
    }}
  ) {
    id
    user{
      id
    }
  }
}
`;

module.exports = {
  getUserDetails,
  checkIfReferalExists,
};
