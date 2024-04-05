const AWS = require('aws-sdk');

const config = require('../config/config');
const getActivityId = require('./getActivityId');

const sqs = new AWS.SQS({
  region: config.region,
});

const insertUserActivity = async (identifier, direction, userId, entityIds) => {
  const activityId = await getActivityId(identifier);

  console.log('Activity id is ', activityId);

  const result = await new Promise((resolve, reject) => {
    const params = {
      MessageBody: JSON.stringify({
        activityId,
        direction,
        userId,
        entityIds,
      }),
      QueueUrl: config.activitiesQueueUrl,
      MessageGroupId: 'activity',
    };

    console.log(activityId, direction, userId, entityIds);

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });

    console.log('Work Done');
  });

  console.log('returning the result', JSON.stringify(await result));
  return result;
};

module.exports = insertUserActivity;
