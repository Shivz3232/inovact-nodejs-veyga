const AWS = require('aws-sdk');
const config = require('../config/config');
const logger = require('../config/logger');

const sqs = new AWS.SQS({
  region: config.region,
});

const enqueueEmailNotification = (entityTypeId, entityId, actorId, notifierIds) =>
  new Promise((resolve, reject) => {
    const params = {
      MessageBody: JSON.stringify({
        entityTypeId,
        entityId,
        actorId,
        notifierIds,
      }),
      QueueUrl: config.emailQueueUrl,
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        logger.info('Enqueued email notification,', entityTypeId, entityId, actorId, notifierIds);
        resolve(data);
      }
    });
  });

module.exports = enqueueEmailNotification;
