const lemmatizer = require('wink-lemmatizer');

function lemmatize(tokens) {
  tokens.forEach((token, index) => {
    tokens[index] = lemmatizer.noun(token) || lemmatizer.verb(token) || lemmatizer.adjective(token) || token;
  });
  return tokens;
}

module.exports = lemmatize;
