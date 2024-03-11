const checkIfUserExists = `query checkIfUserExists($emailId: String) {
    user(where: {email_id: {_eq: $emailId}}) {
        id
    }
}`;

const checkIfReferalExists = `query checkIfReferralExists($cognitoSub: String, $referrerId: Int) {
  referrals(
    where: {
      _and: [
        { user: { cognito_sub: { _eq: $cognitoSub } } },
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
  checkIfUserExists,
  checkIfReferalExists,
};
