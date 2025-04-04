const { query: Hasura } = require('../../../utils/hasura');
const { getUserTeams, getTeam, getUserRole } = require('./queries/queries');
const cleanTeamDocs = require('../../../utils/cleanTeamDocs');
const catchAsync = require('../../../utils/catchAsync');

const getTeams = catchAsync(async (req, res) => {
  const { team_id } = req.query;
  const { cognito_sub } = req.body;

  let query;
  const variables = {};

  if (team_id) {
    variables.team_id = team_id;

    query = getTeam;
  } else {
    if (req.body.admin) variables.admin = true;
    else variables.admin = false;

    variables.cognito_sub = cognito_sub;

    query = getUserTeams;
  }

  const response = await Hasura(query, variables);

  if (team_id) {
    if (response.result.data.team.length === 0) {
      return res.status(400).json({
        success: false,
        errorCode: 'NotFound',
        errorMessage: 'Team not found',
        data: null,
      });
    }

    const cleanedTeamDoc = cleanTeamDocs(response.result.data.team[0]);
    return res.json(cleanedTeamDoc);
  }

  const cleanedTeamDocs = response.result.data.team.map(cleanTeamDocs);

  return res.json(cleanedTeamDocs);
});

module.exports = getTeams;
