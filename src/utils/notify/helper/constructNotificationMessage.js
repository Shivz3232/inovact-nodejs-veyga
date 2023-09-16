function getDescription(id) {
  const descriptions = {
    1: 'liked',
    6: 'liked',
    11: 'liked',
    2: 'commented',
    7: 'commented',
    12: 'commented',
  };
  return descriptions[id] || 'unknown description';
}

function mapNumericToText(id) {
  const entityTypes = {
    1: 'project',
    2: 'project',
    3: 'project',
    4: 'project',
    5: 'project',
    6: 'idea',
    7: 'idea',
    8: 'idea',
    9: 'idea',
    10: 'idea',
    11: 'thought',
    12: 'thought',
    13: 'thought',
    14: 'thought',
    15: 'thought',
    16: 'connection',
    17: 'connection',
    18: 'connection',
    19: 'connection',
    20: 'connection',
  };

  const entityTypeText = entityTypes[id] || 'unknown entity';
  const descriptionText = getDescription(id);
  return { entityTypeText, descriptionText };
}

function handleConnection(id, name) {
  const message = id === 16 ? `${name} has sent you a connection request` : `${name} has accepted your connection request`;
  return message;
}

function handleTeamNotification(id, name) {
  // TODO: Team name yet to include
  const message = id === 23 ? 'You have a new joining request for your team' : `Your request for joining the team is accepted`;
  return message;
}

function constructNotificationMessage(id, name) {
  if (id === 16 || id === 17) {
    return handleConnection(id, name);
  }

  if (id === 21 || id === 23) {
    return handleTeamNotification(id, name);
  }

  const { entityTypeText, descriptionText } = mapNumericToText(id);
  const actionText = descriptionText === 'liked' ? '' : ' on';

  if (entityTypeText === 'unknown entity' || descriptionText === 'unknown description') {
    return 'You got a new notification';
  }

  return `${name} has ${descriptionText}${actionText} your ${entityTypeText}`;
}

module.exports = constructNotificationMessage;
