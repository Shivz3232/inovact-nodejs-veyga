const UpdateUserFCMToken = `mutation UpdateUserFCMToken($cognito_sub: String!, $fcm_token: String!) 
{ update_user(where: {cognito_sub: {_eq: $cognito_sub}}, _set: {fcm_token: $fcm_token}) 
{ affected_rows }
}
`;

module.exports = {
  UpdateUserFCMToken,
};
