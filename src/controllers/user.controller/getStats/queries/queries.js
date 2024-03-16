const getUserContributions = `query getUserContributions($cognitoSub: String) {
  projectsCount: project_aggregate(where: {user:{
    cognito_sub:{
      _eq: $cognitoSub
    }
  }}) {
    aggregate {
      count
    }
  }
  ideasCount: idea_aggregate(where: {user:{
    cognito_sub:{
      _eq: $cognitoSub
    }
  }}) {
    aggregate {
      count
    }
  }
  thoughtsCount: thoughts_aggregate(where: {user:{
    cognito_sub:{
      _eq: $cognitoSub
    }
  }}) {
    aggregate {
      count
    }
  }
}`;

module.exports = {
  getUserContributions,
};
