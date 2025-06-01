const updateUserPhoneNumberMutation = `mutation UpdatePhoneNumber($cognito_sub: String!, $phone_number: String!) {
  update_user(where: {cognito_sub: {_eq: $cognito_sub}}, _set: {phone_number: $phone_number}) {
    affected_rows
  }
}`;

const deleteExistingTokensMutation = `mutation DeleteExistingTokens($user_id: Int!) {
  delete_phone_number_verification_tokens(where: {user_id: {_eq: $user_id}}) {
    affected_rows
  }
}`;

module.exports = {
  updateUserPhoneNumberMutation,
  deleteExistingTokensMutation,
};
