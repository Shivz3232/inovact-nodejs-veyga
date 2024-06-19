const { getUserInfo } = require('../queries/queries.js');
const { query: Hasura } = require('../../../../utils/hasura');
const preprocessUserData = require('../../../../utils/recommendations/preprocessing');

const createUserProfile = async (cognitoSub) => {
  const userInfoQueryResponse = await Hasura(getUserInfo, { cognitoSub });
  const userProfleBag = [
    ...userInfoQueryResponse.result.data.user[0].user_skills.map((skill) => skill.skill),
    ...userInfoQueryResponse.result.data.user[0].user_interests.map(
      (interest) => interest.area_of_interest.interest
    ),
    ...userInfoQueryResponse.result.data.project[0].project_tags.map((tag) => tag.hashtag.name),
  ];

  const userProfileString = userProfleBag.join(' ');
  return preprocessUserData(userProfileString);
};

module.exports = {
  createUserProfile,
};
