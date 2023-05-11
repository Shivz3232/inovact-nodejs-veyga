const { query: Hasura } = require('../../../utils/hasura');
const { possibleToInviteUser } = require('./queries/queries.js');
const { addTeamInvite } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const inviteToTeam = catchAsync(async (req,res)=>{
  const team_id = req.body.team_id;
  const user_id = req.body.user_id;
  const cognito_sub = req.body.cognito_sub;

  const variables = {
    team_id,
    user_id,
    cognito_sub,
  };

  /* Verify if it is possible to invite the user
   * 1. Check if the current user is the team admin
   * 2. Check if the user is already in the team
   * 3. Check if the user is already invited to the team
   * 4. Check if the user has requested to join the team
   */
  const response = await Hasura(possibleToInviteUser, variables);

  if (!response.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  if (
    response.result.data.current_user.length == 0 ||
    !response.result.data.current_user[0].admin
  )
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not the admin of this team',
      data: null,
    });

  if (response.result.data.team_members.length > 0)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'This user is already in the team',
      data: null,
    });

  if (response.result.data.team_invitations.length > 0)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'This user is already invited to this team',
      data: null,
    });

  if (response.result.data.team_requests.length > 0)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage:
        'This user has requested to join this team, please accept or reject the request instead of inviting the user',
      data: null,
    });

  /* Add the user to the team */
  const response1 = await Hasura(addTeamInvite, { team_id, user_id });

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });

  res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = inviteToTeam
