const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { checkIfPossibleToAccept, getRoleRequirement, getTeamJoinedCount } = require('./queries/queries');
const { acceptJoinRequest1, acceptJoinRequest2 } = require('./queries/mutations');
const notify = require('../../../../utils/notify');
const catchAsync = require('../../../../utils/catchAsync');
const insertUserActivity = require('../../../../utils/insertUserActivity');

const awardUserActivityForJoinedTeams = async (userId) => {
  try {
    const getTeamJoinedCountResponse = await Hasura(getTeamJoinedCount, { userId });

    if (getTeamJoinedCountResponse.result.data.team_members.length > 0) {
      const projectTeamJoinedIds = [];
      const ideaTeamJoinedIds = [];

      getTeamJoinedCountResponse.result.data.team_members.forEach((teamMember) => {
        if (teamMember.team.projects.length > 0) projectTeamJoinedIds.push(teamMember.team.projects[0].id);
        if (teamMember.team.ideas.length > 0) ideaTeamJoinedIds.push(teamMember.team.ideas[0].id);
      });

      if (projectTeamJoinedIds.length === 3) {
        await insertUserActivity('getting-accepted-into-first-three-projects', 'positive', userId, projectTeamJoinedIds);
      }

      if (ideaTeamJoinedIds.length === 3) {
        await insertUserActivity('getting-accepted-into-first-three-ideas', 'positive', userId, ideaTeamJoinedIds);
      }
    }
  } catch (error) {
    logger.error('Error in awardUserActivityForJoinedTeams:', error.message);
  }
};

const acceptJoinRequest = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { request_id, cognito_sub } = req.body;

  const variables = {
    request_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfPossibleToAccept, variables);

  if (response1.result.data.team_requests.length == 0)
    return res.status(400).json({
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Request not found',
      data: null,
    });

  if (response1.result.data.team_members.length == 0 || !response1.result.data.team_members[0].admin)
    return res.status(401).json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team',
      data: null,
    });

  const userIdOfRequestingUser = response1.result.data.team_requests[0].user_id;
  let query;
  const variables2 = {
    team_id: response1.result.data.team_requests[0].team_id,
    user_id: userIdOfRequestingUser,
    request_id,
  };

  if (response1.result.data.team_requests[0].role_requirement_id != null) {
    const response2 = await Hasura(getRoleRequirement, {
      roleRequirementId: response1.result.data.team_requests[0].role_requirement_id,
    });

    variables2.role = response2.result.data.team_role_requirements[0].role_name;
    variables2.role_requirement_id = response1.result.data.team_requests[0].role_requirement_id;
    query = acceptJoinRequest1;
  } else {
    variables2.role = 'mentor';
    query = acceptJoinRequest2;
  }

  const response3 = await Hasura(query, variables2);

  // Notify the user and award points
  await notify(21, response1.result.data.team_requests[0].team_id, response1.result.data.team_members[0].user_id, [userIdOfRequestingUser]).catch(console.log);
  insertUserActivity('getting-accepted-into-team', 'positive', userIdOfRequestingUser, [response1.result.data.team_requests[0].team_id]);
  awardUserActivityForJoinedTeams(userIdOfRequestingUser);

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = acceptJoinRequest;
