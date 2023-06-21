const axios = require('axios');
const { query: Hasura } = require('../../utils/hasura');
const { getAreaOfInterests } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../config/logger');

const getInterest = catchAsync(async (req, res) => {
  const response = await Hasura(getAreaOfInterests);

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json(JSON.stringify(response.errors));
  }

  return res.json(response.result.data.area_of_interests);
});

module.exports = getInterest;
