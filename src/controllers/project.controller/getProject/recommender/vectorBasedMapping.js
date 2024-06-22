// ------------------------------------
// Vector format:
// {
//   "term": weight
// }
// ------------------------------------
function calculateCosineSimilarity(queryVector, documentVector) {
  let dotProduct = 0;
  let queryVectorModulus = 0;
  let documentVectorModulus = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const term in queryVector) {
    if (Object.hasOwn(queryVector, term)) {
      dotProduct += queryVector[term] * (documentVector[term] ? documentVector[term] : 0);
      queryVectorModulus += queryVector[term];
    }
  }

  queryVectorModulus = Math.sqrt(queryVectorModulus);

  // eslint-disable-next-line no-restricted-syntax
  for (const term in documentVector) {
    if (Object.hasOwn(documentVector, term)) {
      documentVectorModulus += documentVector[term];
    }
  }

  documentVectorModulus = Math.sqrt(documentVectorModulus);

  if (documentVectorModulus === 0) {
    return 0;
  }

  const similarity = dotProduct / (queryVectorModulus * documentVectorModulus);

  return similarity;
}

module.exports = {
  calculateCosineSimilarity,
};
