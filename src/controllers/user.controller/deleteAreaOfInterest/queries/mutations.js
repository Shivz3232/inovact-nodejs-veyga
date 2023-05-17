const deleteAreaOfInterest = `mutation deleteAreaOfInterest($interest_ids: [Int!], $cognito_sub: String) {
  delete_user_interests(where: {interest_id: {_in: $interest_ids}, user: {cognito_sub: {_eq: $cognito_sub}}}) {
    affected_rows
  }
}`;

module.exports = {
  deleteAreaOfInterest,
};
