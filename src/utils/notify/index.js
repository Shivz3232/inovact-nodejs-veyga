/* eslint-disable */
const admin = require('firebase-admin');
const { query: Hasura } = require('../hasura');
const { getUser, getFcmToken } = require('./queries/queries');
const constructNotificationMessage = require('./constructNotificationMessage');
const constructNotificationBody = require('./constructNotificationBody');

const notify = async (entityTypeId, entityId, actorId, notifierIds) => {
  try {
    const response = await Hasura(getFcmToken, {
      userId: notifierIds,
    });

    const response1 = await Hasura(getUser, {
      userId: actorId,
    });

    const name = response1.result.data.user[0].first_name;

    const {
      result: {
        data: { user },
      },
    } = response;

    const fcmTokens = user.map((item) => item.fcm_token);

    const message = {
      tokens: fcmTokens,
      notification: {
        title: constructNotificationMessage(entityTypeId, name),
        body: constructNotificationBody(entityTypeId),
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
