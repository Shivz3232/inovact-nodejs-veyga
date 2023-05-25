const admin = require('firebase-admin');

const firebaseConfiguration = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
firebaseConfiguration.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

const serviceAccount = firebaseConfiguration;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const deleteUserFunc = async (uid) => {
  const response = await admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      return {
        success: true,
        errors: '',
      };
    })
    .catch((error) => {
      return {
        success: false,
        errors: error,
      };
    });

  return response;
};

module.exports = { deleteUserFunc };
