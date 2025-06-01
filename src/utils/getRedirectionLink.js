function getRedirectionLink(userAgent) {
  // Platform detection
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  if (isIOS) {
    return 'https://apps.apple.com/in/app/inovact-social/id6742887820';
  }

  if (isAndroid) {
    return 'https://play.google.com/store/apps/details?id=in.pranaydas.inovact';
  }

  return 'https://www.inovact.in';
}

module.exports = getRedirectionLink;
