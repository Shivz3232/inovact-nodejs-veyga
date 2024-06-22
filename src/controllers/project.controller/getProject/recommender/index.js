const { TfIdf } = require('natural');
const { createUserProfile } = require('./userProfile');
const { createProjectProfile } = require('./projectProfile');
const { calculateCosineSimilarity } = require('./vectorBasedMapping');

const recommend = async (user, projects) => {
  // ------------------------------------
  // Step 1: Prepare user profile
  // ------------------------------------
  const userProfile = {
    profile: await createUserProfile(user),
  };

  // ------------------------------------
  // Step 2: Prepare project profiles
  // ------------------------------------
  const projectProfiles = new Map();
  for (let i = 0; i < projects.length; i += 1) {
    const profile = await createProjectProfile(projects[i]); // Parallelize

    projectProfiles.set(projects[i].id, { profile, project: projects[i] });
  }

  // ------------------------------------
  // Step 3: Prepare TF-IDF Corpus
  // ------------------------------------
  const tfIdf = new TfIdf();

  let docIdx = 0;
  projectProfiles.forEach((doc) => {
    tfIdf.addDocument(doc.profile);
    doc.tfIdfDocIndex = docIdx;

    docIdx += 1;
  });

  // ------------------------------------
  // Step 4: Formulate document vecotrs
  // ------------------------------------
  projectProfiles.forEach((doc) => {
    doc.vector = {};

    tfIdf.listTerms(doc.tfIdfDocIndex).forEach((item) => {
      doc.vector[item.term] = item.tfidf;
    });
  });

  // ------------------------------------
  // Step 5: Formulate query vector
  // ------------------------------------
  tfIdf.addDocument(userProfile.profile);

  userProfile.vector = {};
  tfIdf.listTerms(projects.length).forEach((item) => {
    userProfile.vector[item.term] = item.tfidf;
  });

  // ------------------------------------
  // Step 6: Score projects
  // ------------------------------------
  projectProfiles.forEach((doc) => {
    doc.score = calculateCosineSimilarity(userProfile.vector, doc.vector);
  });

  // ------------------------------------
  // Step 7: Sort project based on score
  // ------------------------------------
  const projectProfilesSortedByScore = Array.from(projectProfiles)
    .filter((project) => project[1].score !== 0)
    .sort((a, b) => b[1].score - a[1].score);

  // projectProfilesSortedByScore.forEach((projectProfile) => {
  //   console.log(projectProfile[1].score, projectProfile[1].vector)
  //   console.log();
  // })

  // ------------------------------------
  // Step 8: Extract Projects
  // ------------------------------------
  const recommendedProjects = projectProfilesSortedByScore.map((project) => project[1].project);

  return recommendedProjects;
};

module.exports = {
  recommend,
};
