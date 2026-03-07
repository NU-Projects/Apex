const axios = require('axios');
require('dotenv').config();

const SERVICE_NAME = 'AUTH-SERVICE';
const PORT = process.env.PORT || 5003;
const EUREKA_URL = process.env.EUREKA_URL || 'http://netflix-eureka-server:5002';
const INSTANCE_ID = `${SERVICE_NAME}-${PORT}`;

async function register() {
  try {
    await axios.post(`${EUREKA_URL}/eureka/apps/${SERVICE_NAME}`, {
      instance: {
        instanceId: INSTANCE_ID,
        hostName: 'auth-service',
        port: PORT,
        app: SERVICE_NAME,
        status: 'UP'
      }
    });
    console.log(`Registered ${SERVICE_NAME} with Eureka`);
  } catch (err) {
    console.error('Eureka registration failed:', err.message);
  }
}

function startHeartbeat() {
  setInterval(async () => {
    try {
      await axios.put(`${EUREKA_URL}/eureka/apps/${SERVICE_NAME}/${INSTANCE_ID}`);
    } catch (err) {
      console.error('Eureka heartbeat failed, re-registering...');
      register();
    }
  }, 30000);
}

async function discoverService(appName) {
  try {
    const response = await axios.get(`${EUREKA_URL}/eureka/apps/${appName}`);
    const instances = response.data.application.instance;
    if (instances && instances.length > 0) {
      const instance = instances[0];
      return `http://${instance.hostName}:${instance.port}`;
    }
    return null;
  } catch (err) {
    console.error(`Eureka discovery failed for ${appName}:`, err.message);
    return null;
  }
}

async function startEureka() {
  await register();
  startHeartbeat();
}

module.exports = { startEureka, discoverService };