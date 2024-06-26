const { TfIdf } = require('natural');
const { createUserProfile } = require('../../../../utils/recommendations/helper/userProfile');
const { createThoughtProfile } = require('./thoughtProfile');
const {
  calculateCosineSimilarity,
} = require('../../../../utils/recommendations/helper/vectorBasedMapping');

const recommend = async (user, thoughts) => {
  // ------------------------------------
  // Step 1: Prepare user profile
  // ------------------------------------
  const userProfileData = {
    profile: await createUserProfile(user),
  };

  // ------------------------------------
  // Step 2: Prepare project profiles
  // ------------------------------------
  const thoughtProfileMap = new Map();
  for (let i = 0; i < thoughts.length; i += 1) {
    const profile = createThoughtProfile(thoughts[i]); // Parallelize
  
    thoughtProfileMap.set(thoughts[i].id, { profile, thought: thoughts[i] });
  }

  // ------------------------------------
  // Step 3: Prepare TF-IDF Corpus
  // ------------------------------------
  const tfIdf = new TfIdf();

  let docIdx = 0;
  thoughtProfileMap.forEach((doc) => {
    tfIdf.addDocument(doc.profile);
    doc.tfIdfDocIndex = docIdx;

    docIdx += 1;
  });

  // ------------------------------------
  // Step 4: Formulate document vecotrs
  // ------------------------------------
  thoughtProfileMap.forEach((doc) => {
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
  tfIdf.listTerms(thoughts.length).forEach((item) => {
    userProfileData.vector[item.term] = item.tfidf;
  });

  // ------------------------------------
  // Step 6: Score projects
  // ------------------------------------
  thoughtProfileMap.forEach((doc) => {
    doc.score = calculateCosineSimilarity(userProfileData.vector, doc.vector);
  });

  // ------------------------------------
  // Step 7: Sort project based on score
  // ------------------------------------
  const thoughtProfilesSortedByScore = Array.from(thoughtProfileMap)
    .filter((thought) => thought[1].score !== 0)
    .sort((a, b) => b[1].score - a[1].score);

  // ------------------------------------
  // Step 8: Extract Projects
  // ------------------------------------
  const recommendedProjects = thoughtProfilesSortedByScore.map((thought) => thought[1].thought);

  return recommendedProjects;
};

module.exports = {
  recommend,
};
