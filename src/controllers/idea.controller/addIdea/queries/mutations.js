const addIdea = `mutation add_idea($description: String!, $title:String!, $user_id:Int, $team_id: Int, $status: String, $link: String) {
    insert_idea(objects: [{
      description: $description,
      user_id: $user_id,
          title:$title,
      team_id: $team_id,
      status: $status,
      link: $link
    }]) {
      returning {
        id,
        title,
        description,
        user_id,
        created_at
        updated_at
        team_id
        link
        status
        user {
          id
          avatar
          first_name
          last_name
          role
        }
      }
    }
  }`;

const addTags = `mutation addIdea($objects: [idea_tag_insert_input!]!) {
    insert_idea_tag(objects: $objects) {
      affected_rows
    }
  }`;

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

const addRolesRequired = `mutation addRolesRequired($objects: [team_role_requirements_insert_input!]!) {
    insert_team_role_requirements(objects: $objects) {
      returning {
        id
      }
    }
  }`;

const addSkillsRequired = `mutation addSkillRequired($objects: [team_skill_requirements_insert_input!]!) {
    insert_team_skill_requirements(objects: $objects) {
      affected_rows
    }
  }`;

const updateUserFlags = `mutation updateUserEventFlags($userId: Int!, $userEventFlags: user_actions_set_input!) {
  update_user_actions(where: { user_id: { _eq: $userId } }, _set: $userEventFlags) {
    returning {
      id
      feed_tutorial_complete
      team_tutorial_complete
      profile_tutorial_complete
      has_uploaded_project
      has_uploaded_idea
      has_uploaded_thought
      has_sought_team
      has_sought_mentor
      has_sought_team_and_mentor
    }
  }
}`;

module.exports = {
  addIdea,
  addTags,
  addSkillsRequired,
  addRolesRequired,
  updateUserFlags,
};
