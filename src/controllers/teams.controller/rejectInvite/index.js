const { query: Hasura } = require('../../../utils/hasura');
const { rejectInvite: rejectInviteQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const rejectInvite = catchAsync(async (req, res) => {
  const invitation_id = req.body.invitation_id;
  const cognito_sub = req.body.cognito_sub;

  const variables = {
    invitation_id,
    cognito_sub,
  };

  const response = await Hasura(rejectInviteQuery, variables);

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  if (response.result.data.delete_team_invitations.affected_rows === 0)
    return res.json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Invitation not found',
      data: null,
    });

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = rejectInvite;
