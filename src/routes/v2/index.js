const express = require('express');
const userRoute = require('./user.route');
const projectRoute = require('./project.route');
const ideaRoute = require('./idea.route');
const thoughtRoute = require('./thought.route');
const firebaseAuthorizer = require('../../middlewares/firebaseAuthorizer');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/post',
    route: projectRoute,
    needAuthentication: true,
  },
  {
    path: '/user',
    route: userRoute,
    needAuthentication: true,
  },
  {
    path: '/idea',
    route: ideaRoute,
    needAuthentication: true,
  },
  {
    path: '/thoughts',
    route: thoughtRoute,
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

module.exports = router;
