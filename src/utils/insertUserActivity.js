const AWS = require('aws-sdk');
const config = require('../config/config');
const getActivityId = require('./getActivityId/');

const sqs = new AWS.SQS({
  region: config.region,
});

const insertUserActivity = (identifier, direction, userId, entityIds) =>
  new Promise(async (resolve, reject) => {
    const activityId = await getActivityId(identifier);
    console.log('activityId', activityId);
    console.log('ide3ntider,, =', identifier);

    const params = {
      MessageBody: JSON.stringify({
        activity_id: activityId,
        direction,
        userId,
        entityIds,
      }),
      QueueUrl: config.activitiesQueueUrl,
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

module.exports = insertUserActivity;
