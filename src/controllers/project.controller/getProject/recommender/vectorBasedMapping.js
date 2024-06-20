const stringSimilarity = require('string-similarity-js');

/**
 * Calculates the similarity between two strings.
 * @param {string} string1 - The first string.
 * @param {string} string2 - The second string.
 * @returns {number} The similarity score between 0 and 1.
 */

function calculateStringSimilarity(string1, string2) {
  return stringSimilarity.stringSimilarity(string1, string2);
}

module.exports = {
  calculateStringSimilarity,
};
