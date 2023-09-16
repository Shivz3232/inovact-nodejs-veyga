function constructData(entityTypeId, entityId, actorId) {
  if (entityTypeId >= 1 && entityTypeId <= 5)
    return {
      click_action: 'OPEN_PROJECT_ACTIVITY',
      data: {
        project_id: entityId,
      },
    };
  if (entityTypeId >= 6 && entityTypeId <= 10)
    return {
      click_action: 'OPEN_IDEA_ACTIVITY',
      data: {
        idea_id: entityId,
      },
    };
  if (entityTypeId >= 11 && entityTypeId <= 15)
    return {
      click_action: 'OPEN_THOUGHT_ACTIVITY',
      data: {
        thought_id: entityId,
      },
    };
  if (entityTypeId === 17)
    return {
      click_action: 'OPEN_CHAT_LIST_ACTIVITY',
    };

  if (entityTypeId === 26)
    return {
      click_action: 'OPEN_CHAT_ACTIVITY',
      data: {
        user_id: actorId,
      },
    };

  return null;
}

console.log(constructData(6, 1, 1));
module.exports = constructData;
