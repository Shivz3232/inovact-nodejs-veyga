const AWS = require('aws-sdk');
const config = require('../config/config');

const sqs = new AWS.SQS({
  region: config.region,
});

const notify = (entityTypeId, entityId, actorId, notifierIds) =>
  new Promise((resolve, reject) => {
    const params = {
      MessageBody: JSON.stringify({
        entityTypeId,
        entityId,
        actorId,
        notifierIds,
      }),
      QueueUrl: config.notifyQueueUrl,
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

module.exports = notify;
