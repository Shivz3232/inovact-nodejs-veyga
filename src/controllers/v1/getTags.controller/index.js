const { query: Hasura } = require('../../../utils/hasura');
const { getTags, getTagsWithPrefix } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getTag = catchAsync(async (req, res) => {
  const { prefix } = req.query;

  let response;
  if (prefix) {
    response = await Hasura(getTagsWithPrefix, {
      _tag: `${prefix}%`,
    });
  } else {
    response = await Hasura(getTags);
  }

  return res.json(response.result.data.hashtag);
});

module.exports = getTag;
