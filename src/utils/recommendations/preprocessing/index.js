const tokenize = require('./tokenizer');
const stem = require('./stemming');
const lemmatize = require('./lemmatizer');
const removeStopWords = require('./stopWords');

function preprocessText(text) {
  text = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();

  let tokens = tokenize(text);

  tokens = removeStopWords(tokens);

  tokens = lemmatize(tokens);

  tokens = stem(tokens);

  return tokens;
}

module.exports = preprocessText;
