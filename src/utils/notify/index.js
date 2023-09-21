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

    const { click_action, data } = constructData(entityTypeId, entityId, actorId);

    const messages = user.map((user) => {
      return {
        token: user.fcm_token,
        android: {
          notification: {
            title: constructNotificationMessage(entityTypeId, name),
            body: constructNotificationBody(entityTypeId),
            clickAction: click_action,
          },
        },
        data,
      };
    });
    await admin.messaging().sendEach(messages);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = notify;
