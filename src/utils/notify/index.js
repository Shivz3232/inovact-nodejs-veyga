/* eslint-disable */
const admin = require('firebase-admin');
const { query: Hasura } = require('../hasura');
const { getUser, getFcmToken } = require('./queries/queries');
const constructNotificationMessage = require('./helper/constructNotificationMessage');
const constructNotificationBody = require('./helper/constructNotificationBody');
const constructData = require('./helper/constructData');
const notify_deprecated = require('../notify.deprecated');

const notify = async (entityTypeId, entityId, actorId, notifierIds) => {
  try {
    await notify_deprecated(entityTypeId, entityId, actorId, notifierIds);
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
      android_channel_id:'default_channel_id',
      notification: {
        title: constructNotificationMessage(entityTypeId, name),
        body: constructNotificationBody(entityTypeId),
      },
      ...constructData(entityTypeId, entityId, actorId );
    };
    const response2 = await admin.messaging().sendEachForMulticast(message);
  } catch (error) {
    throw error;
  }
};

module.exports = notify;
