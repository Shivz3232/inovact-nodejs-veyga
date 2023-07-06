const { query: Hasura } = require('../../../utils/hasura');
const { deleteTeam: deleteTeamQuery } = require('./queries/mutations');
const { getUserId, checkTeamAdmin } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const deleteTeam = catchAsync(async (req, res) => {
  const team_id = req.query.team_id;

  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // Check if the current user is an admin of that team
  const checkAdminData = {
    team_id,
    user_id: response1.result.data.user[0].id,
  };

  const response2 = await Hasura(checkTeamAdmin, checkAdminData);

  // If not
  if (response2.result.data.team_members.length == 0 || !response2.result.data.team_members[0].admin) {
    return res.json({
      success: false,
      errorCode: 'UnAuthorized',
      erroMessage: 'Only Admin can delete the team',
      data: '',
    });
  }

  // If yes
  const response3 = await Hasura(deleteTeamQuery, { team_id });

  return res.json({
    success: true,
    errorCode: '',
    erroMessage: 'Team deleted successfully',
    data: '',
  });
});

module.exports = deleteTeam;
