const admin = require('firebase-admin');
const { query: Hasura } = require('../hasura');
const { getDetails } = require('./queries/queries');
const constructNotificationMessage = require('./helper/constructNotificationMessage');
const constructNotificationBody = require('./helper/constructNotificationBody');
const constructData = require('./helper/constructData');
const logger = require('../../config/logger');
const notify_deprecated = require('../notify.deprecated');

const notify = async (entityTypeId, entityId, actorId, notifierIds) => {
  const constructDataResult = constructData(entityTypeId, entityId, actorId);
  const { click_action, data } = constructDataResult && { data: {} };

  try {
    await notify_deprecated(entityTypeId, entityId, actorId, notifierIds);
    const response = await Hasura(getDetails, {
      notifierId: notifierIds,
      actorId: actorId,
    });

    const user = response.result.data.user;
    const name = response.result.data.actor;

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
