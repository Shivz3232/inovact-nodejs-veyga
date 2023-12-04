const addProject = `mutation add_project($description: String!, $title: String!, $user_id: Int, $status: String, $team_id: Int, $completed: Boolean, $link: String) {
  insert_project(objects: [{title: $title, description: $description, user_id: $user_id, status: $status, team_id: $team_id, completed: $completed, link: $link}]) {
    returning {
      id
      title
      description
      project_tags {
        hashtag {
          name
        }
      }
      project_likes {
        user_id
      }
      project_comments {
        id
        text
        user_id
      }
      project_mentions {
        user {
          id
          user_name
        }
      }
      project_documents {
        id
        name
        url
        uploaded_at
      }
      status
      team_id
      completed
      link
      created_at
      updated_at
      user {
        id
        avatar
        first_name
        last_name
        role
      }
    }
  }
}
`;

const addMentions = `mutation addMentions($objects: [project_mentions_insert_input!]!) {
  insert_project_mentions(objects: $objects) {
    returning {
      project_id
      user_id
    }
  }
}`;

const addTags = `mutation addProjectTags($objects: [project_tag_insert_input!]!) {
  insert_project_tag(objects: $objects) {
    affected_rows
  }
}
`;

const insertProjectDocument = `mutation insertProjectDocument($name: String!, $url: String!, $projectId: Int!) {
  insert_project_documents_one(object: { name: $name, url: $url, project_id: $projectId }) {
    name
    url
    project_id
  }
}

`;

const addTeam = `mutation addTeam($name: String, $looking_for_members: Boolean, $looking_for_mentors: Boolean, $team_on_inovact: Boolean, $creator_id: Int) {
  insert_team(objects: [{
    name: $name,
    looking_for_members: $looking_for_members,
    looking_for_mentors: $looking_for_mentors,
    team_on_inovact: $team_on_inovact,
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

module.exports = {
  addProject,
  addMentions,
  addTags,
  insertProjectDocument,
  addTeam,
  addMembers,
  addRolesRequired,
  addSkillsRequired,
};
