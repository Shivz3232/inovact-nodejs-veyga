const { query: Hasura } = require('../../../utils/hasura');
const { possibleToJoinTeam } = require('./queries/queries.js');
const { addTeamRequestByStudent, addTeamRequestByMentor, addTeamRequestByEntrepreneurAsMember, addTeamRequestByEntrepreneurAsMentor } = require('./queries/mutations');
const notify = require('../../../utils/notify');
const catchAsync = require('../../../utils/catchAsync');

const joinTeam = catchAsync(async (req, res) => {
  const team_id = req.body.team_id;
  const roleRequirementId = req.body.role_requirement_id;
  const cognito_sub = req.body.cognito_sub;

  const variables = {
    team_id,
    role_requirement_id: typeof roleRequirementId == 'number' ? roleRequirementId : 0,
    cognito_sub,
  };

  const response = await Hasura(possibleToJoinTeam, variables);

  if (response.result.data.team.length == 0)
    return res.json({
      success: false,
      errorCode: 'NotFoundError',
      errorMessage: 'Team not found',
      data: null,
    });

  if (response.result.data.team_members.length > 0)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are already a member of this team.',
      data: null,
    });

  if (response.result.data.team_requests.length > 0)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You have already requested to join this team for this role.',
      data: null,
    });

  if (response.result.data.team_invitations.length > 0)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You have received an invitation from this team. Please act on that',
      data: null,
    });

  const user_id = response.result.data.user[0].id;

  let query;
  let variables1;

  if (response.result.data.user[0].role == 'student') {
    if (!response.result.data.team[0].looking_for_members)
      return res.json({
        success: false,
        errorCode: 'Forbidden',
        errorMessage: 'This team is not looking for members',
        data: null,
      });

    query = addTeamRequestByStudent;

    variables1 = {
      team_id,
      roleRequirementId,
      user_id,
    };
  } else if (response.result.data.user[0].role == 'entrepreneur') {
    if (response.result.data.team[0].creator.role == 'student') {
      if (!response.result.data.team[0].looking_for_mentors)
        return res.json({
          success: false,
          errorCode: 'Forbidden',
          errorMessage: 'This team is not looking for mentors',
          data: null,
        });

      query = addTeamRequestByEntrepreneurAsMentor;

      variables1 = {
        team_id,
        user_id,
      };
    } else {
      if (!response.result.data.team[0].looking_for_members) {
        return res.json({
          success: false,
          errorCode: 'Forbidden',
          errorMessage: 'This team is not looking for members',
          data: null,
        });
      }

      query = addTeamRequestByEntrepreneurAsMember;

      variables1 = {
        user_id,
        roleRequirementId,
        team_id,
      };
    }
  } else {
    if (!response.result.data.team[0].looking_for_mentors)
      return res.json({
        success: false,
        errorCode: 'Forbidden',
        errorMessage: 'This team is not looking for mentors',
        data: null,
      });

    query = addTeamRequestByMentor;

    variables1 = {
      team_id,
      user_id,
      roleRequirementId,
    };
  }

  const response1 = await Hasura(query, variables1);

  // Notify the user
  await notify(
    23,
    team_id,
    user_id,
    response.result.data.notifier_ids.map((x) => x.user_id)
  ).catch(console.log);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = joinTeam;
