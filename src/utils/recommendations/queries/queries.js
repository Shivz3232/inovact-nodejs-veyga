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
    projects{
    project_tags {
      hashtag {
        name
      }
    }
    }
  }
}`;

module.exports = {
  getUserInfo,
};
