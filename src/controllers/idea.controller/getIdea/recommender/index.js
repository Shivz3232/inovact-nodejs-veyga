const { TfIdf } = require('natural');
const { createUserProfile } = require('../../../../utils/recommendations/helper/userProfile');
const { createIdeaProfile } = require('./ideaProfile');
const {
  calculateCosineSimilarity,
} = require('../../../../utils/recommendations/helper/vectorBasedMapping');

const recommend = async (cognitoSub, ideas) => {
  // ------------------------------------
  // Step 1: Prepare user profile
  // ------------------------------------
  const userProfileData = {
    profile: await createUserProfile(cognitoSub),
  };

  // ------------------------------------
  // Step 2: Prepare idea profiles
  // ------------------------------------
  const ideaProfileMap = new Map();
  for (let i = 0; i < ideas.length; i += 1) {
    const profile = createIdeaProfile(ideas[i]); // Parallelize

    ideaProfileMap.set(ideas[i].id, { profile, idea: ideas[i] });
  }

  // ------------------------------------
  // Step 3: Prepare TF-IDF Corpus
  // ------------------------------------
  const tfIdf = new TfIdf();

  let docIdx = 0;
  ideaProfileMap.forEach((doc) => {
    tfIdf.addDocument(doc.profile);
    doc.tfIdfDocIndex = docIdx;

    docIdx += 1;
  });

  // ------------------------------------
  // Step 4: Formulate document vecotrs
  // ------------------------------------
  ideaProfileMap.forEach((doc) => {
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
  tfIdf.listTerms(ideas.length).forEach((item) => {
    userProfileData.vector[item.term] = item.tfidf;
  });

  // ------------------------------------
  // Step 6: Score Ideas
  // ------------------------------------
  ideaProfileMap.forEach((doc) => {
    doc.score = calculateCosineSimilarity(userProfileData.vector, doc.vector);
  });

  // ------------------------------------
  // Step 7: Sort idea based on score
  // ------------------------------------
  const ideaProfilesSortedByScore = Array.from(ideaProfileMap)
    .filter((idea) => idea[1].score !== 0)
    .sort((a, b) => b[1].score - a[1].score);

  // ------------------------------------
  // Step 8: Extract Ideas
  // ------------------------------------
  const recommendedIdeas = ideaProfilesSortedByScore.map((idea) => idea[1].idea);

  return recommendedIdeas;
};

module.exports = {
  recommend,
};
