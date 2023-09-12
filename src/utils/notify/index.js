/* eslint-disable */
const admin = require('firebase-admin');
const { query: Hasura } = require('../hasura');
const { getFcmToken } = require('./queries');

const notify = async (entityTypeId, entityId, actorId, notifierIds) => {
  try {
    const response = await Hasura(getFcmToken, {
      id: { _in: notifierIds },
    });

    const {
      result: { data },
    } = response;

    const fcmTokens = data.map((item) => item.fcmToken);

    const message = {
      tokens: fcmTokens,
      notification: {
        title: 'Your Notification Title',
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

    const response1 = await admin.messaging().sendEachForMulticast(message);
  } catch (error) {
    throw error;
  }
};

module.exports = notify;
