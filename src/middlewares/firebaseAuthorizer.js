const admin = require('firebase-admin');

firebaseConfiguration = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
firebaseConfiguration['private_key'] = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

const firebaseAuthorizer = async (req, res, next) => {
  const authorizationToken = await req.headers['authorization'];

  if (!authorizationToken) {
    return res
      .status(401)
      .json({ success: false, errorCode: 'UnAuthorizedUser', errorMessage: 'User Authorization token not found' });
  }

  const result = await admin
    .auth()
    .verifyIdToken(authorizationToken)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return null;
    });

  if (!result) {
    return res
      .status(401)
      .json({ success: false, errorCode: 'UnAuthorizedUser', errorMessage: 'User Authorization token not found' });
  }

  req.body.cognito_sub = result.uid;
  next();
};

module.exports = firebaseAuthorizer;
