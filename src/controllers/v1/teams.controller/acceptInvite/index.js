const { query: Hasura } = require('../../../../utils/hasura');
const { getInvitationDetails } = require('./queries/queries');
const { acceptInvite } = require('./queries/mutations');
const catchAsync = require('../../../../utils/catchAsync');

const acceptInvitation = catchAsync(async (req, res) => {
  const { invitation_id, cognito_sub } = req.body;

  const response2 = await Hasura(getInvitationDetails, { id: invitation_id });

  // Check if the user is the one invited
  if (response2.result.data.team_invitations[0].user.cognito_sub != cognito_sub)
    return res.status(400).json({
      success: false,
      errorCode: 'Unauthorized',
      errorMessage: 'You are not the one invited',
      data: null,
    });

  const variables = {
    user_id: response2.result.data.team_invitations[0].user_id,
    team_id: response2.result.data.team_invitations[0].team_id,
    invitation_id,
  };

  const response3 = await Hasura(acceptInvite, variables);

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = acceptInvitation;
