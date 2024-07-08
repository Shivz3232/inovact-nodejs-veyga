const { getUserInfo } = require('../queries/queries');
const { query: Hasura } = require('../../hasura');
const preprocessUserData = require('../preprocessing');

const createUserProfile = async (cognitoSub) => {
  const userInfoQueryResponse = await Hasura(getUserInfo, { cognitoSub });
  const userProfleBag = [
    ...userInfoQueryResponse.result.data.user[0].user_skills.map((skill) => skill.skill),
    ...userInfoQueryResponse.result.data.user[0].user_interests.map(
      (interest) => interest.area_of_interest.interest
    ),
    ...userInfoQueryResponse.result.data.user[0].projects.flatMap((project) =>
      project.project_tags.map((tag) => tag.hashtag.name)
    ),
  ];

  const userProfileString = userProfleBag.join(' ');
  return preprocessUserData(userProfileString);
};

module.exports = {
  createUserProfile,
};
