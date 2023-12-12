const admin = require('firebase-admin');
const logger = require('../config/logger');

const firebaseConfiguration = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
firebaseConfiguration.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

const firebaseAuthorizer = async (req, res, next) => {
  const authorizationToken = await req.headers.authorization;

  if (!authorizationToken) {
    return res.redirect('https://play.google.com/store/apps/details?id=in.pranaydas.inovact');
  }

  const result = await admin
    .auth()
    .verifyIdToken(authorizationToken)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      logger.error(err);
      return null;
    });

  if (!result) {
    return res.redirect('https://play.google.com/store/apps/details?id=in.pranaydas.inovact');
  }

  req.body.cognito_sub = result.uid;
  next();
};

module.exports = firebaseAuthorizer;
