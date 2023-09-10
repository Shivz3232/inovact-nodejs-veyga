const admin = require('firebase-admin');
const { query: Hasura } = require('./hasura');
const { getFcmToken } = require('./queries/queries');

const notify = (entityTypeId, entityId, actorId, userId) => {
  const fcmToken = Hasura(getFcmToken, {
    id: { _eq: userId },
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
      data,
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
