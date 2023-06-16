const { query: Hasura } = require('../hasura');
const { addMembers, addTeam } = require('./queries/mutations');
const logger = require('../../config/logger');

async function createDefaultTeam(user_id, name, looking_for_mentors, looking_for_members, team_on_inovact) {
  const teamData = {
    name,
    creator_id: user_id,
    looking_for_members,
    looking_for_mentors,
    team_on_inovact,
  };

  const response1 = await Hasura(addTeam, teamData);

  if (!response1.success) {
    logger.error(response1.errors);
    return {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed while creating default team.',
      data: null,
    };
  }

  const members = {
    objects: [
      {
        team_id: response1.result.data.insert_team.returning[0].id,
        user_id,
        admin: true,
      },
    ],
  };

  const response2 = await Hasura(addMembers, members);

  if (!response2.success) {
    logger.error(response2.errors);
    return {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed while adding default admin.',
      data: null,
    };
  }

  return {
    success: true,
    errorCode: '',
    errorMessage: '',
    team_id: response1.result.data.insert_team.returning[0].id,
  };
}

module.exports = createDefaultTeam;
