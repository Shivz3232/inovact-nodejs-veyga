const getProjects = `query getProjects($cognito_sub: String) {
  project(order_by: { created_at: desc } ,where :{user : {status : {_neq:0}}}) {
    id
    title
    description
    link
    project_tags {
      hashtag {
        name
      }
    }
    project_likes: project_likes_aggregate {
      result: aggregate {
        count
      }
    }
    has_liked: project_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
      result: aggregate {
        count
      }
    }
    project_comments {
      id
      text
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
    created_at
    updated_at
    user {
      id
      avatar
      first_name
      last_name
      role
    }
    team {
      id
      name
      avatar
      looking_for_mentors
      looking_for_members
      team_members {
        user {
          id
          first_name
          last_name
          user_name
          role
          admin
          avatar
        }
      }
    }
  }
}`;

const getProject = `query getProject($id: Int, $cognito_sub: String) {
  project(where: {  id :{_eq: $id}  , user :{status :{_neq:0}}}) {
    id
    title
    description
    link
    project_tags {
      hashtag {
        name
      }
    }
    project_likes: project_likes_aggregate {
      result: aggregate {
        count
      }
    }
    has_liked: project_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
      result: aggregate {
        count
      }
    }
    project_comments {
      id
      text
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
    created_at
    updated_at
    user {
      id
      avatar
      first_name
      last_name
      role
    }
    team {
      id
      name
      avatar
      looking_for_mentors
      looking_for_members
      team_members {
        user {
          id
          first_name
          last_name
          user_name
          role
          admin
          avatar
        }
      }
    }
  }
}
`;

const getConnections = `query getConnections($cognito_sub: String) {
  connections(where: {
    _or: [
      { user: {cognito_sub: {_eq: $cognito_sub }}},
      { userByUser2: {cognito_sub: {_eq: $cognito_sub }}}
    ]
  }) {
    user1
    user2
    status
  }
  user (where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
  }
}`;

const getUserInfo = `query getUserInfo($cognitoSub: String) {
  user(where: {
    cognito_sub: {
      _eq: $cognitoSub
    }
  }) {
    user_skills {
      skill
    }
    user_interests {
      area_of_interest {
        interest
      }
    }
  }
  project(where: {
    user: {
      cognito_sub: {
        _eq: $cognitoSub
      }
    }
  }) {
    project_tags {
      hashtag {
        name
      }
    }
  }
}`;

module.exports = {
  getProjects,
  getProject,
  getConnections,
  getUserInfo,
};
