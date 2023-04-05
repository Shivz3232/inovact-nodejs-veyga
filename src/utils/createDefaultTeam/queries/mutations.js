
  
  const addTeam = `mutation addTeam($name: String, $looking_for_members: Boolean, $looking_for_mentors: Boolean, $creator_id: Int) {
    insert_team(objects: [{
      name: $name,
      looking_for_members: $looking_for_members,
      looking_for_mentors: $looking_for_mentors,
      creator_id: $creator_id
    }]) {
      returning {
        id
      }
    }
  }
  `;
  
  const addMembers = `mutation addMembers($objects: [team_members_insert_input!]!) {
    insert_team_members(objects: $objects) {
      returning {
        user_id
        team_id
        admin
        joined_date
      }
    }
  }`;

  
  module.exports = {
    addTeam,
    addMembers
  };
  