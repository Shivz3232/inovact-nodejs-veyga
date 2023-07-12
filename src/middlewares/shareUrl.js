const detectMobileBrowser = require('detect-mobile-browser');

const shareUrl = async (req, res, next) => {
  const userAgent = detectMobileBrowser(req.headers['user-agent']);

  let appInstalled = userAgent.isMobile() && userAgent.isBrowser() && userAgent.match();
  if (!appInstalled) {
    res.redirect('https://play.google.com/store/apps/details?id=in.pranaydas.inovact');
  } else next();
};

module.exports = shareUrl;
