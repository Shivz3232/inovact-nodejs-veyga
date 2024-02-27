const { query: Hasura } = require('../hasura');
const { getActivityIdQuery } = require('./queries/queries');

const activityCache = new Map();

async function getActivityId(identifier) {
  // Check if the activityId is already in the cache
  if (activityCache.has(identifier)) {
    return activityCache.get(identifier);
  }

  // If not in cache, query the database
  const getActivityIdQueryResponse = await Hasura(getActivityIdQuery, {
    identifier,
  });

  if (getActivityIdQueryResponse.result.data.activities.length === 0) {
    throw new Error('Activity not found');
  }
  const activityId = getActivityIdQueryResponse.result.data.activities[0].id;

  // Cache the result
  activityCache.set(identifier, activityId);

  return activityId;
}

module.exports = getActivityId;
