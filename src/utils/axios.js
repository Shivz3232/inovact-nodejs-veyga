const AWS = require('aws-sdk');
const axios = require('axios');
const http = require('http');
const https = require('https');
const config = require('../config/config');
const logger = require('../config/logger');

const serviceDiscovery = new AWS.ServiceDiscovery({
  region: config.region,
});

const getHasuraECSInstancesFromCloudMap = async () => {
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
async function getHostedHasuraInstance() {
  const hasuraInstances = await getHasuraECSInstancesFromCloudMap().catch(logger.error);

  if (!hasuraInstances || hasuraInstances.length === 0) return;

  // Select the next instance in a round-robin fashion
  const selectedInstance = hasuraInstances[instanceIndex];
  instanceIndex = (instanceIndex + 1) % hasuraInstances.length; // Update the index for the next request

  console.log('Pratik: Found hosted hasura instance');
  return selectedInstance;
}

function getProviderHasuraInstance() {
  return axios.create({
    baseURL: config.hasuraApi,
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
    httpAgent: new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 60 * 60 * 1000,
      maxSockets: Infinity,
    }),
    httpsAgent: new https.Agent({
      keepAlive: true,
      keepAliveMsecs: 60 * 60 * 1000,
      maxSockets: Infinity,
    }),
  });
}

const getBestInstance = async () => {
  console.log(`Pratik: ${config.NODE_ENV}: ${config.hasuraApi} And ${config.hasuraAdminSecret}`);
  if (config.NODE_ENV !== 'development') {
    const hostedHasuraInstance = await getHostedHasuraInstance();

    if (hostedHasuraInstance) {
      console.log('Pratik: Found hosted hasura instance');
      const instanceAttributes = hostedHasuraInstance.Attributes;

      return axios.create({
        baseURL: `http://${instanceAttributes.AWS_INSTANCE_IPV4}:${instanceAttributes.AWS_INSTANCE_PORT}/v1/graphql`,
        headers: null,
        httpAgent: new http.Agent({
          keepAlive: true,
          keepAliveMsecs: 60 * 60 * 1000,
          maxSockets: Infinity,
        }),
        httpsAgent: new https.Agent({
          keepAlive: true,
          keepAliveMsecs: 60 * 60 * 1000,
          maxSockets: Infinity,
        }),
      });
    }
  }
  console.log('Pratik: Did not found hosted hasura instance');
  return getProviderHasuraInstance();
};

module.exports = {
  createInstance: getBestInstance,
  getProviderHasuraInstance,
  getHostedHasuraInstance,
};
