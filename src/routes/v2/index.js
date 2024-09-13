const express = require('express');
const userRoute = require('./user.route');
const firebaseAuthorizer = require('../../middlewares/firebaseAuthorizer');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/user',
    route: userRoute,
    needAuthentication: true,
  },
];

defaultRoutes.forEach((route) => {
  if (route.needAuthentication) {
    router.use(route.path, firebaseAuthorizer, route.route);
  } else {
    router.use(route.path, route.route);
  }
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
