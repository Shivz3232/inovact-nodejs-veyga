const rejectInvite = `mutation rejectInvitation($invitation_id: Int, $cognito_sub: String) {
  delete_team_invitations(where: {_and: [{id: {_eq: $invitation_id}}, {user: {cognito_sub: {_eq: $cognito_sub}}}]}) {
    affected_rows
  }
}
`;

module.exports = {
  rejectInvite,
};
