const natural = require('natural');

function stem(tokens) {
  const stemmer = natural.PorterStemmer;
  return tokens.map((token) => stemmer.stem(token));
}

module.exports = stem;
