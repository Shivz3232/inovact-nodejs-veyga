const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const ideaRoute = require('./idea.route');
const thoughtRoute = require('./thought.route');
const connectionRoute = require('./connection.route');
const privateMessageRoute = require('./privateMessage.route');
const interestRoute = require('./interest.route');
const skillRoute = require('./skills.route');
const roleRoute = require('./roles.route');
const teamRoute = require('./teams.route');
const commentRoute = require('./comment.route');
const notificationRoute = require('./notification.route');
const projectRoute = require('./project.route');
const tagRoute = require('./getTags.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const firebaseAuthorizer = require('../../middlewares/firebaseAuthorizer');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/post',
    route: projectRoute,
  },
  {
    path: '/idea',
    route: ideaRoute,
  },
  {
    path: '/thoughts',
    route: thoughtRoute,
  },
  {
    path: '/connections',
    route: connectionRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/team',
    route: teamRoute,
  },
  {
    path: '/interests',
    route: interestRoute,
  },
  {
    path: '/skills',
    route: skillRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/comment',
    route: commentRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/messaging',
    route: privateMessageRoute,
  },
  {
    path: '/tags',
    route: tagRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, firebaseAuthorizer, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
