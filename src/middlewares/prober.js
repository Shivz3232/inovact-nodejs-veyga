const logger = require('../config/logger');

// Probe the request for debugging purposes
const prober = (req, res, next) => {
  const info = {
    // headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body,
  };

  logger.verbose('body', info);

  next();
};

module.exports = prober;
