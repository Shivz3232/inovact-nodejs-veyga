const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
  region: process.env.REGION,
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
      QueueUrl: process.env.NOTIFY_QUEUE_URL,
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
