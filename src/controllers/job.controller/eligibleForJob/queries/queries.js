const getEligibilityData = `query GetEligibilityData($cognito_sub: String!) {
  user_aggregate(where: {cognito_sub: {_eq: $cognito_sub}, phone_number: {_is_null: false}}) {
    aggregate {
      count
    }
  }
  project_aggregate(where: {user: {cognito_sub: {_eq: $cognito_sub}}, github_repo_name: {_is_null: false}}) {
    aggregate {
      count
    }
  }
}`;

module.exports = {
  getEligibilityData,
};
