function descriptions(id) {
  if (id === 1 || id === 6 || id === 11) return 'liked';
  if (id === 2 || id === 7 || id === 12) return 'commented';
}
function mapNumericToText(id) {
  let entityTypeText;
  if (id >= 1 && id <= 5) {
    entityTypeText = 'project';
  } else if (id >= 6 && id <= 10) {
    entityTypeText = 'idea';
  } else if (id >= 11 && id <= 15) {
    entityTypeText = 'thought';
  } else if (id >= 16 && id <= 20) {
    entityTypeText = 'connection';
  } else {
    entityTypeText = 'unknown entity';
  }

  const descriptionText = descriptions(id) || 'unknown description';
  return { entityTypeText, descriptionText };
}

const handleConnection = (id, name) => {
  const message = id === 16 ? `${name} has sent you a connection request` : `${name} has accepted your connection request`;
  return message;
};

const handleTeamNotification = (id, name) => {
  const message = id === 23 ? `You have a new joining request for your team` : `Your request for joining the team for ProjectName is accepted`;
  return message;
};

function constructNotificationMessage(id, name) {
  if (id === 16 || id === 17) {
    return handleConnection(id, name);
  }

  if (id === 21 || id === 23) {
    return handleTeamNotification(id, name);
  }

  const { entityTypeText, descriptionText } = mapNumericToText(id);
  return `${name} has ${descriptionText}${descriptionText === 'liked' ? '' : ' on'} your ${entityTypeText}`;
}

module.exports = constructNotificationMessage;
