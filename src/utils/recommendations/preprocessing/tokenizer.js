const natural = require('natural');

const tokenizer = new natural.WordTokenizer();

function tokenize(text) {
  return tokenizer.tokenize(text);
}

module.exports = tokenize;
