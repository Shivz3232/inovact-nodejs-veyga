function cleanThoughtDoc(thought) {
  thought.thought_likes = thought.thought_likes.result.count;
  thought.has_liked = thought.has_liked.result.count === 1;

  return thought;
}

module.exports = cleanThoughtDoc;
