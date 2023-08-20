const winston = require('winston');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

let logLevel;
switch (config.env) {
  case 'production':
    logLevel = 'info';
    break;
  case 'staging':
    logLevel = 'verbose';
    break;
  case 'development':
    logLevel = 'debug';
    break;
  default:
    logLevel = 'debug';
}

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf((info) => {
      if (info.body && typeof info.body === 'object') {
        info.body = JSON.stringify(info.body, null, 3);
      }

      return `${info.level}: ${info.message} ${info.body || ''}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
