const express = require('express');
// const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const postRoute = require('./post.route');
const ideaRoute = require('./idea.route');
const thoughtRoute = require('./thought.route');
const connectionRoute = require('./connection.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  // {
  //   path: '/auth',
  //   route: authRoute,
  // },
  // {
  //   path: '/users',
  //   route: userRoute,
  // },
  {
    path: '/post',
    route: postRoute,
  },
  {
    path: '/idea',
    route: ideaRoute,
  },
  {
    path: '/thought',
    route: thoughtRoute,
  },
  {
    path: '/connection',
    route: connectionRoute,
  },
  {
    path: '/user',
    route: userRoute,
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
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
