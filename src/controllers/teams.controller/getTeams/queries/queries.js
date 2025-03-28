const getUserTeams = `query getMyTeams($cognito_sub: String, $admin: Boolean) {
  team(where: { team_members: {user: {cognito_sub: {_eq: $cognito_sub}}, _or: [{admin: {_eq: true}}, {admin: {_eq: $admin}}]}}) {
    id
    name
    description
    avatar
    looking_for_members
    looking_for_mentors
    team_role_requirements(where: {
        is_filled : {_eq: false}
      }){
      id
      role_name
      team_skill_requirements {
        id
        skill_name
      }
    }
    team_invitations {
      invited_at
      user {
        id
        first_name
        last_name
        avatar
        role
      }
    }
    team_requests {
      id
      user {
        id
        first_name
        last_name
        avatar
        role
      }
      team_role_requirement {
        id
        role_name
      }
      requested_on
    }
    team_members {
      joined_date
      admin
      role
      user {
        id
        avatar
        first_name
        last_name
        role
      }
    }
    team_documents {
      id
      name
      mime_type
      uploaded_at
      url
    }
    projects {
      id
      title
      status
      description
      tags :project_tags{
        hashtag{
          id,
          name
        }
      }
    }
    ideas {
      id
      title
      status
      description
      tags :idea_tags{
        hashtag{
          id,
          name
        }
      }
    }
    team_tags {
      hashtag {
        id
        name
      }
    }
  }
}
`;

const getTeam = `query getTeam($team_id: Int) {
  team(where: {id: { _eq: $team_id }}) {
    id
    name
    description
    avatar
    looking_for_members
    looking_for_mentors
    team_role_requirements(where: {
        is_filled : {_eq: false}
      } ){
      id
      role_name
      team_skill_requirements {
        id
        skill_name
      }
    }
    team_invitations {
      invited_at
      user {
        id
        first_name
        last_name
        avatar
        role
      }
    }
    team_requests {
      id
      user {
        id
        first_name
        last_name
        avatar
        role
      }
      team_role_requirement {
        id
        role_name
      }
      requested_on
    }
    team_members {
      joined_date
      admin
      role
      user {
        id
        avatar
        first_name
        last_name
        role
      }
    }
    team_documents {
      id
      name
      mime_type
      uploaded_at
      url
    }
    projects {
      id
      title
      status
      description
      tags :project_tags{
        hashtag{
          id,
          name
        }
      }
    }
    ideas {
      id
      title
      status
      description
      tags :idea_tags{
        hashtag{
          id,
          name
        }
      }
    }
    team_tags {
      hashtag {
        id
        name
      }
    }
   
  }
}`;

const getUserRole = `
  query getUserRole($cognito_sub: String!) {
    user(where: {cognito_sub: {_eq: $cognito_sub}}) {
      role
    }
  }
`;

module.exports = {
  getUserTeams,
  getTeam,
  getUserRole,
};
