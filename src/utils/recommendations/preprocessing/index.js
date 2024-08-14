const tokenize = require('./tokenizer');
const lemmatize = require('./lemmatizer');
const removeStopWords = require('./stopWords');

function preprocessText(text) {
  text = text
    .toLowerCase()
    .replace(/[^\w\s]|\d/g, '')
    .trim();

  let tokens = tokenize(text);

  tokens = removeStopWords(tokens);

  tokens = lemmatize(tokens);

  return tokens;
}

module.exports = preprocessText;
