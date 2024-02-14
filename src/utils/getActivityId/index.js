const { query: Hasura } = require('../hasura');
const { getActivityIdQuery } = require('./queries/queries');

async function getActivityId(identifier) {
  const getActivityIdQueryResponse = await Hasura(getActivityIdQuery, {
    identifier,
  });

  const activityId = getActivityIdQueryResponse.result.data.activities[0].id;

  return activityId;
}

module.exports = getActivityId;
