const preprocessUserData  = require('../../../../utils/recommendations/preprocessing');

const createUserProfile = (user) => {
  return preprocessUserData(user);
};

module.exports = {
  createUserProfile,
};
