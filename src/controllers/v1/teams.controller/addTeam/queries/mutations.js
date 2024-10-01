const addTeam = `mutation addTeam($name: String, $avatar: String, $description: String, $creator_id: Int) {
  insert_team(objects: [{
    name: $name,
    avatar: $avatar,
    description: $description,
    creator_id: $creator_id
  }]) {
    returning {
      id
    }
  }
}
`;

const addInvitations = `mutation addInvitations($objects: [team_invitations_insert_input!]!) {
  insert_team_invitations(objects: $objects) {
    returning {
      id
    }
  }
}
`;

const addRoles = `mutation addRoles($objects: [team_role_requirements_insert_input!]!) {
  insert_team_role_requirements(objects: $objects) {
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

const addTeamTags = `mutation addTeamTags($objects: [team_tag_insert_input!]!) {
  insert_team_tag(objects: $objects) {
    affected_rows
  }
}`;

const addSkills = `mutation addSkills($objects: [team_skill_requirements_insert_input!]!) {
  insert_team_skill_requirements(objects: $objects) {
    returning {
      id
    }
  }
}
`;

module.exports = {
  addTeam,
  addInvitations,
  addRoles,
  addMembers,
  addTeamTags,
  addSkills,
};
