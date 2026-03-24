const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SERVICE_NAME = 'ROADMAP-SERVICE';
const PORT = process.env.ROADMAP_SERVICE_PORT || 5006;
const EUREKA_URL = process.env.EUREKA_URL || 'http://localhost:5001';
const HOST_NAME = process.env.HOSTNAME || 'localhost';
const INSTANCE_ID = `${SERVICE_NAME}-${PORT}`;

async function register() {
  try {
    await axios.post(`${EUREKA_URL}/eureka/apps/${SERVICE_NAME}`, {
      instance: {
        instanceId: INSTANCE_ID,
        hostName: HOST_NAME,
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

async function startEureka() {
  await register();
  startHeartbeat();
}

module.exports = { startEureka };
