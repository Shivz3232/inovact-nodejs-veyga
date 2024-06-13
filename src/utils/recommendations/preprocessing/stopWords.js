const natural = require('natural');

function removeStopWords(tokens) {
  const stopWords = new Set(natural.stopwords);
  return tokens.filter((token) => !stopWords.has(token));
}

module.exports = removeStopWords;
