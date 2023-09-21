const admin = require('firebase-admin');
const { query: Hasura } = require('../hasura');
const { getUser, getFcmToken } = require('./queries/queries');
const constructNotificationMessage = require('./helper/constructNotificationMessage');
const constructNotificationBody = require('./helper/constructNotificationBody');
const constructData = require('./helper/constructData');
const logger = require('../../config/logger');
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
    const { click_action, data } = constructData(entityTypeId, entityId, actorId);

    const message = {
      tokens: fcmTokens,
      notification: {
        title: constructNotificationMessage(entityTypeId, name),
        body: constructNotificationBody(entityTypeId),
      },
      data,
    };
    const response2 = await admin.messaging().sendEachForMulticast(message);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = notify;
