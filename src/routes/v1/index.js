const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const allUsersRoute = require('./alluser.route');
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
const fcmRoute = require('./fcm.route');
const config = require('../../config/config');
const firebaseAuthorizer = require('../../middlewares/firebaseAuthorizer');
const propellRoute = require('./propell.route');
const userActionRoute = require('./userAction.route');
const userPointsRoute = require('./userPoints.route');
const referralRoute = require('./referral.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
    needAuthentication: true,
  },
  {
    path: '/users',
    route: allUsersRoute,
    needAuthentication: true,
  },
  {
    path: '/post',
    route: projectRoute,
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
  {
    path: '/connections',
    route: connectionRoute,
    needAuthentication: true,
  },
  {
    path: '/user',
    route: userRoute,
    needAuthentication: true,
  },
  {
    path: '/team',
    route: teamRoute,
    needAuthentication: true,
  },
  {
    path: '/interests',
    route: interestRoute,
    needAuthentication: true,
  },
  {
    path: '/skills',
    route: skillRoute,
    needAuthentication: true,
  },
  {
    path: '/roles',
    route: roleRoute,
    needAuthentication: true,
  },
  {
    path: '/comment',
    route: commentRoute,
    needAuthentication: true,
  },
  {
    path: '/notifications',
    route: notificationRoute,
    needAuthentication: true,
  },
  {
    path: '/messaging',
    route: privateMessageRoute,
    needAuthentication: true,
  },
  {
    path: '/tags',
    route: tagRoute,
    needAuthentication: true,
  },
  {
    path: '/fcm',
    route: fcmRoute,
    needAuthentication: true,
  },

  {
    path: '/propell',
    route: propellRoute,
    needAuthentication: false,
  },
  {
    path: '/userActions',
    route: userActionRoute,
    needAuthentication: true,
  },
  {
    path: '/userPoints',
    route: userPointsRoute,
    needAuthentication: true,
  },
  {
    path: '/referral',
    route: referralRoute,
    needAuthentication: true,
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
