const natural = require('natural');

const stopWords = new Set(natural.stopwords);

function removeStopWords(tokens) {
  return tokens.filter((token) => !stopWords.has(token));
}

module.exports = removeStopWords;
