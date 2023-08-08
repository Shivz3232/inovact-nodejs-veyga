function cleanNotificationDoc(notificationDoc) {
  let res = {
    id: notificationDoc.id,
    entity_type_id: notificationDoc.notification_object.entity_type_id,
    entity_id: notificationDoc.notification_object.entity_id,
  };

  console.log(notificationDoc);
  res['actor'] = notificationDoc.notification_object.notification_changes[0]?.user;

  return res;
}

module.exports = cleanNotificationDoc;
