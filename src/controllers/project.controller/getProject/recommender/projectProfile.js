const preprocessProjectData = require('../../../../utils/recommendations/preprocessing');

function createProjectProfile(project) {
  if (!project.project_tags) {
    return preprocessProjectData('');
  }

  const projectTags = project.project_tags.map((tag) => tag.name);

  const projectTagsString = projectTags.join(' ');

  console.log(projectTagsString);
  return preprocessProjectData(projectTagsString);
}

module.exports = {
  createProjectProfile,
};
