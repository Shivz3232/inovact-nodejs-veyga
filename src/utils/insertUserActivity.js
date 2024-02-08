const AWS = require('aws-sdk');
const config = require('../config/config');

const sqs = new AWS.SQS({
  region: config.region,
});

const insertUserActivity = (activityId, direction, userId) =>
  new Promise((resolve, reject) => {
    const params = {
      MessageBody: JSON.stringify({
        activity_id: activityId,
        direction,
        userId,
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
