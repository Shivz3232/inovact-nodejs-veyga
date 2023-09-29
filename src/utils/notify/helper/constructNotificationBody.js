function constructNotificationBody(id) {
  if (id === 1 || id === 6 || id === 11) return 'Check it out';
  if (id === 2 || id === 7 || id === 12) return 'Check it out';
  if (id === 16 || id === 23) return 'Approve or Reject the request';
  if (id === 17) return 'Send them a Hi!';
  if (id === 21) return 'Congratulations! 🎉';

  return 'Check it out';
}

module.exports = constructNotificationBody;
