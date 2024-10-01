const getInvitationDetails = `query getInvitationDetails($id: Int) {
  team_invitations(where: {id: { _eq: $id}}) {
    id
    team_id
    user_id
    user {
      cognito_sub
    }
  }
}`;

module.exports = {
  getInvitationDetails,
};
