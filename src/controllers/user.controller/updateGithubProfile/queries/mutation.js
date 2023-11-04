const UpdateGithubProfile = `mutation UpdateGithubProfile($cognito_sub: String!, $github_profile: String!) 
{ update_user(where: {cognito_sub: {_eq: $cognito_sub}}, _set: {github_profile: $github_profile}) 
{ affected_rows }
}`;

module.exports = {
  UpdateGithubProfile,
};
