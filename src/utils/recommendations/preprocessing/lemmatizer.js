const lemmatizer = require('wink-lemmatizer');

function lemmatize(tokens) {
  return tokens.map((token) => lemmatizer.noun(token) || lemmatizer.verb(token) || lemmatizer.adjective(token) || token);
}

module.exports = lemmatize;
