function constructNotificationBody(id) {
  if (id === 1 || id === 6 || id === 11) return 'Check it out';
  // actual comment here
  if (id === 2 || id === 7 || id === 12) return 'Check it out';

  if (id === 16) return 'Approve or Reject the request';
  if (id === 17) return 'Send them a Hi!';
  else return 'Check it out';
}

module.exports = constructNotificationBody;
