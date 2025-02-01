const getUserIdFromCognito = `query getUserIdFromCognito($cognito_sub: String) {
    user(where: {cognito_sub: {_eq: $cognito_sub}}) {
      id
    }
  }`;

const getTeamMembers = `query getTeamMembers($team_id: Int) {
    team_members(where: {team_id: {_eq: $team_id}}) {
      user_id
    }
  }`;

module.exports = {
  getUserIdFromCognito,
  getTeamMembers,
};
