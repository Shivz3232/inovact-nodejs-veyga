const getTeamMessages = `query getTeamMessages($team_id: Int!, $timeStamp: timestamptz, $limit: Int) {
  team_messages(
    where: {
      team_id: { _eq: $team_id }
      created_at: { _lte: $timeStamp }
    }
    order_by: {created_at: desc } 
    limit: $limit
  ) {
    id
    message
    team_id
    user_id
    created_at
    updated_at
  }
}
`;

const checkIfUserInTeam = `query checkIfUserInTeam($team_id: Int, $cognito_sub: String) {
  members: team_members(where: {team_id: {_eq: $team_id}, user: {cognito_sub: {_eq: $cognito_sub}}}) {
    user_id
    admin
    team {
      creator_id
    }
  }
}`;

module.exports = {
  getTeamMessages,
  checkIfUserInTeam,
};
