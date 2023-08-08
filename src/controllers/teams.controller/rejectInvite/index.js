const { query: Hasura } = require('../../../utils/hasura');
const { rejectInvite: rejectInviteQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const rejectInvite = catchAsync(async (req, res) => {
  const { invitation_id, cognito_sub } = req.body;

  const variables = {
    invitation_id,
    cognito_sub,
  };

  const response = await Hasura(rejectInviteQuery, variables);

  if (response.result.data.delete_team_invitations.affected_rows === 0)
    return res.status(400).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Invitation not found',
      data: null,
    });

  return res.status(204).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = rejectInvite;
