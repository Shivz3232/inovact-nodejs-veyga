const catchAsync = require('../../../utils/catchAsync');
const { getAllUsersQuery } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');

// Helper function to normalize university names, remove whitespace
const normalizeUniversity = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Helper function to check if two university names are similar
const areSimilarUniversities = (uni1, uni2) => {
  const norm1 = normalizeUniversity(uni1);
  const norm2 = normalizeUniversity(uni2);
  
  // Check if either normalized name includes the other
  return norm1.includes(norm2) || norm2.includes(norm1);
};

const getAllUsers = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const response = await Hasura(getAllUsersQuery, { cognito_sub });
  const userInfo = response.result.data.user_info[0];

  if (!userInfo) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { university: userUniversity } = userInfo;
  const allUsers = response.result.data.all_users;

  const sortedUsers = allUsers.sort((a, b) => {
    const aIsSimilar = areSimilarUniversities(a.university, userUniversity);
    const bIsSimilar = areSimilarUniversities(b.university, userUniversity);

    if (aIsSimilar && !bIsSimilar) return -1;
    if (!aIsSimilar && bIsSimilar) return 1;
    return 0;
  });

  return res.json(sortedUsers);
});

module.exports = getAllUsers;