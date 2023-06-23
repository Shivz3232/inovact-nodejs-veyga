const { query: Hasura } = require('../../../utils/hasura');
const { checkIfMember } = require('./queries/queries');
const { updateTeam } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const updateTeams = catchAsync(async (req, res) => {
  const { team_id, avatar, cognito_sub, team_name, looking_for_members, looking_for_mentors, team_on_inovact } = req.body;

  const variables = {
    team_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfMember, variables);

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to check if user is admin',
      data: null,
    });
  }

  if (response1.result.data.team_members.length == 0 || !response1.result.data.team_members[0].admin)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'User is not an admin of the team',
      data: null,
    });

  let updates = {
    avatar,
  };

  if (team_name) updates.name = team_name;
  if (looking_for_members) updates.looking_for_members = looking_for_members;
  if (looking_for_mentors) updates.looking_for_mentors = looking_for_mentors;
  if (team_on_inovact) updates.team_on_inovact = team_on_inovact;

  const variables2 = {
    team_id,
    updates,
  };

  const response2 = await Hasura(updateTeam, variables2);

  if (!response2.success) {
    logger.error(JSON.stringify(response2.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to update team',
      data: null,
    });
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = updateTeams;
