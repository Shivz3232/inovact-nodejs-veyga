const natural = require('natural');

const stemmer = natural.PorterStemmer;

function stem(tokens) {
  return tokens.map((token) => stemmer.stem(token));
}

module.exports = stem;
