const preprocessProjectData = require('../../../../utils/recommendations/preprocessing');
const createProjectProfile = (project) => {

  // @TODO
  // const projectTagsString = project.reduce((tagsString, project) => {
  //   const hashtagName = project.project_tags.hashtag.name;
  //   return tagsString ? `${tagsString} ${hashtagName}` : hashtagName;
  // }, '');

  // return preprocessProjectData(projectTagsString);
};

module.exports = {
  createProjectProfile,
};
