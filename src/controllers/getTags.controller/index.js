const { query: Hasura } = require('../../utils/hasura');
const { getTags, getTagsWithPrefix } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../config/logger');

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

  if (!response.success) {
    logger.error(response.errors);
    return res.json(response.errors);
  }

  return res.json(response.result.data.hashtag);
});

module.exports = getTag;
