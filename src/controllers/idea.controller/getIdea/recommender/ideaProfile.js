const preprocessIdeaData = require('../../../../utils/recommendations/preprocessing');

function createIdeaProfile(idea) {
  if (!idea.idea_tags) {
    return preprocessIdeaData('');
  }

  const ideaTags = idea.idea_tags.map((tag) => tag.name);

  const ideaTagsString = ideaTags.join(' ');

  return preprocessIdeaData(ideaTagsString);
}

module.exports = {
  createIdeaProfile,
};
