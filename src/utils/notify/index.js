/* eslint-disable */
const admin = require('firebase-admin');
const { query: Hasura } = require('../hasura');
const getUser = require('./queries/queries');
const { getFcmToken } = require('./queries/mutations');
const constructNotificationMessage = require('./constructNotificationMessage');

const notify = async (entityTypeId, entityId, actorId, notifierIds) => {
  try {
    const response = await Hasura(getFcmToken, {
      id: { _in: notifierIds },
    });

    const response1 = await Hasura(getUser, {
      id: { _eq: actorId },
    });

    const name = response1.result.data.user[0].first_name;

    const {
      result: { data },
    } = response;

    const fcmTokens = data.map((item) => item.fcmToken);

    const message = {
      tokens: fcmTokens,
      notification: {
        title: constructNotificationMessage(entityId, name),
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

    const response2 = await admin.messaging().sendEachForMulticast(message);
  } catch (error) {
    throw error;
  }
};

module.exports = notify;
