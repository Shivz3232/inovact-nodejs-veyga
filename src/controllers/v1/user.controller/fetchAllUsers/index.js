const catchAsync = require('../../../../utils/catchAsync');
const { getAllUsersQuery } = require('./queries/queries');
const { query: Hasura } = require('../../../../utils/hasura');

// Helper function to normalize university names
const normalizeUniversity = (name) => {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Helper function to calculate similarity between two university names
const universitySimilarity = (uni1, uni2) => {
  const norm1 = normalizeUniversity(uni1);
  const norm2 = normalizeUniversity(uni2);

  if (norm1 === norm2) return 1; // Exact match
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.5; // Partial match
  return 0; // No match
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
    const aSimilarity = universitySimilarity(a.university, userUniversity);
    const bSimilarity = universitySimilarity(b.university, userUniversity);

    if (aSimilarity !== bSimilarity) {
      return bSimilarity - aSimilarity; // Higher similarity first
    }

    // If similarities are equal, sort alphabetically by name
    return (a.first_name + ' ' + a.last_name).localeCompare(b.first_name + ' ' + b.last_name);
  });

  return res.json(sortedUsers);
});

module.exports = getAllUsers;
