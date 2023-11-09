const GetTeamMessages = `query GetTeamMessages($teamId: uuid!, $timestamp: timestamptz, $limit: Int) {
  team_messages(
    where: {
      team_id: { _eq: $teamId }
      created_at: { _lte: $timestamp }
    }
    limit: $limit
  ) {
    Id
    message
    team_id
    user_id
    created_at
    updated_at
  }
}`;

const checkIfUserInTeam = `query checkIfUserInTeam($user_id: Int, $team_id: Int, $cognito_sub: String) {
  members: team_members(where: {team_id: {_eq: $team_id}, user_id: {_eq: $user_id}}) {
    user_id
    admin
    team {
      creator_id
    }
  }
  admins: team_members(where: {team_id: {_eq: $team_id}, user: {cognito_sub: {_eq: $cognito_sub}}, admin: {_eq: true}}) {
    user_id
  }
}`;

const getUserIdFromCognitoSub = `query getUserIdFromCognitoSub($cognito_sub: String) {
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
  }
}`;
module.exports = {
  GetTeamMessages,
  checkIfUserInTeam,
  getUserIdFromCognitoSub,
};
