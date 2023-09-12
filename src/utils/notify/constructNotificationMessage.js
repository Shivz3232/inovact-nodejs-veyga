/* eslint-disable */

function descriptions(id) {
  if (id === 1 || id === 6 || id === 1) return 'liked';
  if (id === 2 || id === 7 || id === 12) return 'commented';
}
function mapNumericToText(id) {
  let entityTypeText;
  if (id >= 1 && id <= 5) {
    entityTypeText = 'post';
  } else if (id >= 6 && id <= 10) {
    entityTypeText = 'idea';
  } else if (id >= 11 && id <= 15) {
    entityTypeText = 'thought';
  } else {
    entityTypeText = 'unknown entity';
  }

  const descriptionText = descriptions(id) || 'unknown description';
  return { entityTypeText, descriptionText };
}

function constructNotificationMessage(id, name) {
  const { entityTypeText, descriptionText } = mapNumericToText(id);
  return `${name} ${descriptionText} your ${entityTypeText}`;
}

module.exports = constructNotificationMessage;
