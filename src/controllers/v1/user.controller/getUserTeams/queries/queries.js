const getUserTeams = `query getMyTeams($user_id: Int) {
  team(where: { team_members: { user_id: { _eq: $user_id }}}) {
    id
    name
    avatar
    looking_for_members
    looking_for_mentors
    team_role_requirements {
      role {
        id
        name
      }
      team_skill_requirements {
        skill {
          id
          name
        }
      }
    }
    team_invitations {
      invited_at
      user {
        id
        first_name
        last_name
      }
    }
    team_requests {
      user_id
      requested_on
    }
    team_members {
      joined_date
      admin
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
    }
    projects {
      title
      status
    }
    ideas {
      id
      title
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

const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

module.exports = {
  getUserTeams,
  getUserId,
};
