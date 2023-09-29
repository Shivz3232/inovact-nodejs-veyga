function constructData(entityTypeId, entityId, actorId) {
  entityId = String(entityId);
  actorId = String(actorId);

  if (entityTypeId >= 1 && entityTypeId <= 5)
    return {
      click_action: 'OPEN_PROJECT_ACTIVITY',
      data: {
        project_id: `${entityId}`,
      },
    };
  if (entityTypeId >= 6 && entityTypeId <= 10)
    return {
      click_action: 'OPEN_IDEA_ACTIVITY',
      data: {
        idea_id: `${entityId}`,
      },
    };
  if (entityTypeId >= 11 && entityTypeId <= 15)
    return {
      click_action: 'OPEN_THOUGHT_ACTIVITY',
      data: {
        thought_id: `${entityId}`,
      },
    };
  if (entityTypeId >= 16 && entityTypeId <= 20)
    return {
      click_action: 'OPEN_CHAT_LIST_ACTIVITY',
    };

  if (entityTypeId >= 21 && entityTypeId <= 25)
    return {
      click_action: 'OPEN_PROJECT_ACTIVITY',
    };

  if (entityTypeId === 26)
    return {
      click_action: 'OPEN_CHAT_ACTIVITY',
      data: {
        user_id: `${actorId}`,
      },
    };

  return null;
}

module.exports = constructData;
