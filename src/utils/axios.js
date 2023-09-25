const AWS = require('aws-sdk');
const axios = require('axios');
const http = require('http');
const https = require('https');
const config = require('../config/config');
const logger = require('../config/logger');

const serviceDiscovery = new AWS.ServiceDiscovery({
  region: config.region,
});

const getHasuraInstancesFromCloudMap = async () => {
  const params = {
    ServiceId: config.cloudMapHasuraServiceId,
  };

  const data = await serviceDiscovery
    .listInstances(params)
    .promise()
    .catch(() => {});

  if (!data || !data.Instances) {
    return;
  }

  return data.Instances;
};

let instanceIndex = 0;
async function chooseHasuraInstance() {
  const hasuraInstances = await getHasuraInstancesFromCloudMap().catch(logger.error);

  if (!hasuraInstances || hasuraInstances.length === 0) return;

  // Select the next instance in a round-robin fashion
  const selectedInstance = hasuraInstances[instanceIndex];
  instanceIndex = (instanceIndex + 1) % hasuraInstances.length; // Update the index for the next request

  return selectedInstance;
}

const createInstance = async () => {
  let baseURL = config.hasuraApi;
  const headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': config.hasuraAdminSecret,
  };

  if (config.NODE_ENV !== 'development') {
    const hasuraInstance = await chooseHasuraInstance();

    if (hasuraInstance) {
      const instanceAttributes = hasuraInstance.Attributes;

      baseURL = `http://${instanceAttributes.AWS_INSTANCE_IPV4}:${instanceAttributes.AWS_INSTANCE_PORT}/v1/graphql`;
      headers['x-hasura-admin-secret'] = null;
    } else {
      logger.debug('No hasura instances found, continuing with default instance');
    }
  }

  return axios.create({
    baseURL,
    headers,
    httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 60 * 60 * 1000, maxSockets: Infinity }),
    httpsAgent: new https.Agent({ keepAlive: true, keepAliveMsecs: 60 * 60 * 1000, maxSockets: Infinity }),
  });
};

module.exports = {
  createInstance,
};
