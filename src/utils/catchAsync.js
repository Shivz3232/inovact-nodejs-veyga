const logger = require('../config/logger');
const { hasuraNoDataException, hasuraRequestFailed } = require('./hasuraError');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (err.name === 'QueryError') {
      logger.error(JSON.stringify(err));

      return res.status(400).json({
        success: false,
        errorCode: err.name,
        errorMessage: JSON.stringify(err.message[0]),
        data: null,
      });
    }
    if (err.name === 'RequestError') {
      logger.error(JSON.stringify(err));

      return res.status(400).json({
        success: false,
        errorCode: err.name,
        errorMessage: err.message,
        data: null,
      });
    }
    next(err);
  });
};

module.exports = catchAsync;
