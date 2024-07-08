const preprocessthoughtData = require('../../../../utils/recommendations/preprocessing');

function createThoughtProfile(thought) {
  if (thought.length === 0) {
    return preprocessthoughtData('');
  }

  return preprocessthoughtData(thought.thought);
}

module.exports = {
  createThoughtProfile,
};
