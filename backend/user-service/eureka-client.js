const Eureka = require('eureka-js-client').Eureka;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const port = parseInt(process.env.USER_SERVICE_PORT, 10) || 5005;

const client = new Eureka({
  instance: {
    app: 'USER-SERVICE',
    instanceId: `USER-SERVICE:${port}`,
    hostName: process.env.HOSTNAME || 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://127.0.0.1:${port}/user`,
    healthCheckUrl: `http://127.0.0.1:${port}/user`,
    port: {
      '$': port,
      '@enabled': 'true',
    },
    vipAddress: 'USER-SERVICE',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    leaseInfo: {
      renewalIntervalInSecs: 30,
      durationInSecs: 90,
    },
  },
  eureka: {
    host: 'localhost',
    port: process.env.EUREKA_PORT || 5001,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
    heartbeatInterval: 30000,
    registryFetchInterval: 30000,
  },
});

function startEureka() {
  client.logger.level('warn');
  client.start(error => {
    if (error) {
      console.error('Eureka registration failed:', error);
    } else {
      console.log(`Registered: USER-SERVICE -> 127.0.0.1:${port}`);
    }
  });

  // Handle heartbeat errors
  client.on('heartbeat', () => {
    // Heartbeat successful
  });

  client.on('registryUpdated', () => {
    // Registry updated
  });
}

module.exports = { startEureka, eurekaClient: client };
