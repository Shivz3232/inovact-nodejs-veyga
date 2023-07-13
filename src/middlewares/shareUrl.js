const UserAgent = require('express-useragent');

const shareUrl = async (req, res, next) => {
  const userAgent = UserAgent.parse(req.headers['user-agent']);

  const appInstalled = userAgent.isAndroid && userAgent.isChrome && userAgent.isFirefox;

  if (!appInstalled) {
    res.redirect('https://play.google.com/store/apps/details?id=in.pranaydas.inovact');
  } else next();
};

module.exports = shareUrl;
