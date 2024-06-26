const { TfIdf } = require('natural');
const { createUserProfile } = require('../../../../utils/recommendations/helper/userProfile');
const { createProjectProfile } = require('./projectProfile');
const {
  calculateCosineSimilarity,
} = require('../../../../utils/recommendations/helper/vectorBasedMapping');

const recommend = async (user, projects) => {
  // ------------------------------------
  // Step 1: Prepare user profile
  // ------------------------------------
  const userProfileData = {
    profile: await createUserProfile(user),
  };

  // ------------------------------------
  // Step 2: Prepare project profiles
  // ------------------------------------
  const projectProfileMap = new Map();
  for (let i = 0; i < projects.length; i += 1) {
    const profile = createProjectProfile(projects[i]); // Parallelize

    projectProfileMap.set(projects[i].id, { profile, project: projects[i] });
  }

  // ------------------------------------
  // Step 3: Prepare TF-IDF Corpus
  // ------------------------------------
  const tfIdf = new TfIdf();

  let docIdx = 0;
  projectProfileMap.forEach((doc) => {
    tfIdf.addDocument(doc.profile);
    doc.tfIdfDocIndex = docIdx;

    docIdx += 1;
  });

  // ------------------------------------
  // Step 4: Formulate document vecotrs
  // ------------------------------------
  projectProfileMap.forEach((doc) => {
    doc.vector = {};

    tfIdf.listTerms(doc.tfIdfDocIndex).forEach((item) => {
      doc.vector[item.term] = item.tfidf;
    });
  });

  // ------------------------------------
  // Step 5: Formulate query vector
  // ------------------------------------
  tfIdf.addDocument(userProfileData.profile);

  userProfileData.vector = {};
  tfIdf.listTerms(projects.length).forEach((item) => {
    userProfileData.vector[item.term] = item.tfidf;
  });

  // ------------------------------------
  // Step 6: Score projects
  // ------------------------------------
  projectProfileMap.forEach((doc) => {
    doc.score = calculateCosineSimilarity(userProfileData.vector, doc.vector);
  });

  // ------------------------------------
  // Step 7: Sort project based on score
  // ------------------------------------
  const projectProfilesSortedByScore = Array.from(projectProfileMap)
    .filter((project) => project[1].score !== 0)
    .sort((a, b) => b[1].score - a[1].score);

  // ------------------------------------
  // Step 8: Extract Projects
  // ------------------------------------
  const recommendedProjects = projectProfilesSortedByScore.map((project) => project[1].project);

  return recommendedProjects;
};

module.exports = {
  recommend,
};
