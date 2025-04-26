const getEligibilityData = `query GetEligibilityData($cognito_sub: String!) {
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    phone_number
    portfolio_link
  }
  project_aggregate(where: {user: {cognito_sub: {_eq: $cognito_sub}}, github_repo_url: {_is_null: false}}) {
    aggregate {
      count
    }
  }
}`;

module.exports = {
  getEligibilityData,
};
