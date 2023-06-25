const { query: Hasura } = require('../../../utils/hasura');
const { getUserTeams, getTeam } = require('./queries/queries');
const cleanTeamDocs = require('../../../utils/cleanTeamDocs');
const catchAsync = require('../../../utils/catchAsync');

const getTeams = catchAsync(async (req, res) => {
  const team_id = req.query.team_id;

  let query;
  let variables = {};

  // Choose the varialbes and query based on the team_id
  if (team_id) {
    variables['team_id'] = team_id;

    query = getTeam;
  } else {
    if (req.body.admin) variables['admin'] = true;
    else variables['admin'] = false;

    variables['cognito_sub'] = req.body.cognito_sub;

    query = getUserTeams;
  }

  // Run the query
  const response = await Hasura(query, variables);

  if (team_id) {
    if (response.result.data.team.length == 0) {
      return res.json({
        success: false,
        errorCode: 'NotFound',
        errorMessage: 'Team not found',
        data: null,
      });
    } else {
      const cleanedTeamDoc = cleanTeamDocs(response.result.data.team[0]);

      return res.json(cleanedTeamDoc);
    }
  } else {
    const cleanedTeamDocs = response.result.data.team.map(cleanTeamDocs);

    return res.json(cleanedTeamDocs);
  }
});

module.exports = getTeams;
