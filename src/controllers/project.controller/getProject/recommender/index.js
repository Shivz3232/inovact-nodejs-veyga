const { createUserProfile } = require('../userProfile');
const { createProjectProfile } = require('../projectProfile');
const { calculateCosineSimilarity } = require('../vectorBasedMapping');

const recommend = (user, projects) => {
  const userProfile = createUserProfile(user);
  const projectProfiles = projects.map(createProjectProfile);

  const scoredProjects = projectProfiles.map((projectProfile) => {
    const score = calculateCosineSimilarity(userProfile, projectProfile);
    return { ...projectProfile, score };
  });

  const recommendedProjects = scoredProjects.filter((project) => project.score > 0).sort((a, b) => b.score - a.score);

  return recommendedProjects;
};

module.exports = {
  recommend,
};
