const natural = require('natural');

function tokenize(text) {
  const tokenizer = new natural.WordTokenizer();
  return tokenizer.tokenize(text);
}

module.exports = tokenize;
