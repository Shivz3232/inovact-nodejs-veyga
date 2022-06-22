const axios = require('axios');
const http = require('http');
const https = require('https');
const config = require('../config/config');

const instance = axios.create({
  baseURL: config.hasuraApi,
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': config.hasuraAdminSecret,
  },
  httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 60 * 60 * 1000, maxSockets: Infinity }),
  httpsAgent: new https.Agent({ keepAlive: true, keepAliveMsecs: 60 * 60 * 1000, maxSockets: Infinity }),
});

module.exports = instance;
