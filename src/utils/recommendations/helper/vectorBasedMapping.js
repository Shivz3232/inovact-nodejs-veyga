/**
 * Calculate the cosine similarity between two vectors.
 * @param {Object.<string, number>} queryVector - The query vector.
 * @param {Object.<string, number>} documentVector - The document vector.
 * @returns {number} The cosine similarity between the vectors./
 */

function calculateCosineSimilarity(queryVector, documentVector) {
  // Early return for empty vectors
  if (Object.keys(queryVector).length === 0 || Object.keys(documentVector).length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let queryVectorSquared = 0;
  let docuemntVectorSquared = 0;

  // Process query vector and calculate dot product
  for (const term of Object.keys(queryVector)) {
    const queryWeight = queryVector[term];
    queryVectorSquared += queryWeight ** 2; // Eucledian form computation, considered better than the previouse l1/Manhatton norm

    const documentWeight = documentVector[term] || 0;
    dotProduct += queryWeight * documentWeight;
  }

  // Early return if query vector magnitude is zero
  if (queryVectorSquared === 0) {
    return 0;
  }

  // Process document vector
  for (const term of Object.keys(documentVector)) {
    const documentWeight = documentVector[term];
    docuemntVectorSquared += documentWeight ** 2; // Eucledian form computation, considered better than the previouse l1/Manhatton norm
  }

  // Early return if document vector magnitude is zero
  if (docuemntVectorSquared === 0) {
    return 0;
  }

  return (
    dotProduct / (Math.sqrt(queryVectorSquared) * Math.sqrt(docuemntVectorSquared)) // Implace computations
  );
}

module.exports = {
  calculateCosineSimilarity,
};
