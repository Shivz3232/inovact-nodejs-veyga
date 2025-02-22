const updateIdea = `mutation updateIdea($id: Int_comparison_exp, $changes: idea_set_input) {
  update_idea(where: { id: $id }, _set: $changes) {
    returning {
      id,
      team_id,
      user_id,
      team {
        looking_for_members
        looking_for_mentors
      }
    }
  }
}`;

const UpdateIdeaTeam = `mutation UpdateIdeaTeam($ideaId: Int!, $newTeamId: Int!) {
  update_idea_by_pk(
    pk_columns: { id: $ideaId }
    _set: { team_id: $newTeamId }
  ) {
    id
    team_id
  }
}`;

const updateIdeaFlags = `mutation updateIdeaFlags($team_id: Int, $lookingForMentors: Boolean, $lookingForMembers: Boolean) {
  update_team(
    where: { id: { _eq: $team_id } }
    _set: { looking_for_mentors: $lookingForMentors, looking_for_members: $lookingForMembers }
  ) {
    returning {
      id
    }
  }
}`;

const updateIdeaTags = `mutation updateIdeaTags($ideaId: Int, $tags: [idea_tag_insert_input!]!) {
  delete_idea_tag(where: { idea_id: { _eq: $ideaId } }) {
    affected_rows
  }
  insert_idea_tag(objects: $tags) {
    affected_rows
  }
}`;

const updateRolesRequired = `mutation updateRolesRequired($teamId: Int, $newRoles: [team_role_requirements_insert_input!]!) {
  delete_team_role_requirements(where: { team_id: { _eq: $teamId } }) {    returning {
      id
    }}
  insert_team_role_requirements(objects: $newRoles) {
    returning {
      id
    }
  }
}
`;

module.exports = {
  updateIdea,
  updateIdeaFlags,
  UpdateIdeaTeam,
  updateIdeaTags,
  updateRolesRequired,
  //   addRolesRequired,
  //   addSkillsRequired,
  //   deleteTeam,
  //   updateLookingForTeamMembersAndMentors,
};
