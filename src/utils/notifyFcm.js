const admin = require('firebase-admin');

const sendFCMNotification = (token, entityTypeId, entityId, actorId, notifierIds) => {
  new Promise(async (resolve, reject) => {
    const message = {
      token,
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

module.exports = sendFCMNotification;
