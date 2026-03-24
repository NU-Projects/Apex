const Eureka = require('eureka-js-client').Eureka;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const port = parseInt(process.env.USER_SERVICE_PORT, 10) || 5005;

const client = new Eureka({
  instance: {
    app: 'user-service',
    hostName: process.env.HOSTNAME || 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://localhost:${port}/user`,
    healthCheckUrl: `http://localhost:${port}/user`,
    port: {
      '$': port,
      '@enabled': 'true',
    },
    vipAddress: 'user-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: process.env.EUREKA_PORT || 5001,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

function startEureka() {
  client.logger.level('warn');
  client.start(error => {
    if (error) {
      console.error('Eureka registration failed:', error);
    } else {
      console.log('Registered with Eureka successfully!');
    }
  });
}

module.exports = { startEureka, eurekaClient: client };
