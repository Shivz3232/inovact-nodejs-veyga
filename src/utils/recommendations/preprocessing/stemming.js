const natural = require('natural');

const stemmer = natural.PorterStemmer;

function stem(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    tokens[i] = stemmer.stem(tokens[i]);
  }
  return tokens;
}

module.exports = stem;
