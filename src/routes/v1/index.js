const express = require('express');
// const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const postRoute = require('./post.route');
const ideaRoute = require('./idea.route');
const thoughtsRoute = require('./thoughts.route');
const connectionsRoute = require('./connections.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

router.get('/status', (req, res) => {
  res.send('OK');
});

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
    path: '/thoughts',
    route: thoughtsRoute,
  },
  {
    path: '/connections',
    route: connectionsRoute,
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
