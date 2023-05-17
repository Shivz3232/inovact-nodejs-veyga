const {
    addTeam,
    addMembers
} = require('./queries/mutations');
async function createDefaultTeam(
    user_id,
    name,
    looking_for_mentors,
    looking_for_members
  ) {
    const teamData = {
      name,
      creator_id: user_id,
      looking_for_members,
      looking_for_mentors,
    };
  
    const response1 = await Hasura(addTeam, teamData);
  
    if (!response1.success) {
      return {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed while creating default team.',
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
      return {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed while adding default admin.',
      };
    }
  
    return {
      success: true,
      team_id: response1.result.data.insert_team.returning[0].id,
    };
  }
  
  module.exports = createDefaultTeam;
  