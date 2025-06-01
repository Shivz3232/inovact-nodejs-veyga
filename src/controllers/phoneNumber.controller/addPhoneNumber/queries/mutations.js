const addPhoneNumberMutation = `mutation AddPhoneNumber($user_id: Int!, $token: String!, $expires_at: timestamp!) {
  insert_phone_number_verification_tokens_one(object: {user_id: $user_id, token: $token, expires_at: $expires_at}) {
    id
  }
}`;

const deleteExistingTokensMutation = `mutation DeleteExistingTokens($user_id: Int!) {
  delete_phone_number_verification_tokens(where: {user_id: {_eq: $user_id}}) {
    affected_rows
  }
}`;

module.exports = {
  addPhoneNumberMutation,
  deleteExistingTokensMutation,
};
