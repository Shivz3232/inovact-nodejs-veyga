const { query: Hasura } = require('../../../utils/hasura');
const { deleteTeam : deleteTeamQuery } = require('./queries/mutations');
const { getUserId, checkTeamAdmin } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const deleteTeam = catchAsync(async (req,res)=>{
  const team_id = await req.body.team_id;

  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success) return res.json(response1.errors);

  // Check if the current user is an admin of that team
  const checkAdminData = {
    team_id,
    user_id: response1.result.data.user[0].id,
  };

  const response2 = await Hasura(checkTeamAdmin, checkAdminData);

  if (!response2.success) return res.json(response2.errors);

  // If not
  if (
    response2.result.data.team_members.length == 0 ||
    !response2.result.data.team_members[0].admin
  )
    return callback('Only team admin can delete the team');

  // If yes
  const response3 = await Hasura(deleteTeamQuery, { team_id });

  if (!response3.success) return res.json(response3.errors);

  res.json(response3.result);
});

module.exports = deleteTeam
