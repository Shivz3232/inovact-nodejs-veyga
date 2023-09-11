const admin = require('firebase-admin');
const { query: Hasura } = require('../hasura');
const { getFcmToken } = require('./queries');

const notify = (entityTypeId, entityId, actorId, notifierIds) => {
  const fcmToken = Hasura(getFcmToken, {
    id: { _eq: notifierIds },
  }).then((res) => res.json().data);

  new Promise(async (resolve, reject) => {
    const message = {
      fcmToken,
      notification: {
        title,
        body: JSON.stringify({
          entityTypeId,
          entityId,
          actorId,
          notifierIds,
        }),
      },
      data: {
        customKey: 'customValue',
      },
    };
    try {
      const response = await admin.messaging().send(message);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = notify;
