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

const checkIfReferalExists = `query checkIfReferralExists($userId: Int, $referrerId: Int) {
  referrals(
    where: {
      _and: [
        { user_id: {_eq: $userId} },
        { referrer_id: { _eq: $referrerId } }
      ]
    }
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
