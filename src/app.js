const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
// const mongoSanitize = require('express-mongo-sanitize');
// const compression = require('compression');
const cors = require('cors');
// const passport = require('passport');
const httpStatus = require('http-status');

const config = require('./config/config');
const logger = require('./config/logger');
const morgan = require('./config/morgan');
// const { jwtStrategy } = require('./config/passport');
// const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const prober = require('./middlewares/prober');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Serve static files from the 'public' folder
app.use(express.static('public'));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
// app.use(mongoSanitize());

// gzip compression
// app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

// Prober
app.use(prober);

// API to check server status
app.get('/', (_, res) => {
  res.send('PONG');
});

app.get('/status', (_, res) => {
  res.send('OK');
});

// For verifying android app
app.get('/.well-known/assetlinks.json', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'assetlinks.json');

  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      logger.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Parse the JSON and send it as the response
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

// For iOS universal links
app.get('/.well-known/apple-app-site-association', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'apple-app-site-association.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      logger.error('Error reading apple-app-site-association.json file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  });
});

// For verifying ssl certificate
app.get('/.well-known/pki-validation/*', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'C857BCD112583B284088B97482AE9D4C.txt');

  // Read the TXT file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      logger.error('Error reading TXT file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.hasHeader('Content-Type', 'text/plain');
    res.end(data);
  });
});

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((_, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
