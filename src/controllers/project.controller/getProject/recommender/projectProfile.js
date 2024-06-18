const preprocessProjectData = require('../../../../utils/recommendations/preprocessing');

const createProjectProfile = (project) => {
  return preprocessProjectData(project);
};

module.exports = {
  createProjectProfile,
};
