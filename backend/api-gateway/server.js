const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { startEureka } = require('./eureka-client');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 5000;

app.use(express.json());

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5002',
  eureka: process.env.EUREKA_SERVER_URL || 'http://localhost:5001'
};

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway Service is running' });
});


// Route: /auth* -> auth-service
app.all('/auth/{*path}', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.auth}${req.path}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /eureka* -> netflix-eureka-server
app.all('/eureka/{*path}', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.eureka}${req.path}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  startEureka();
});
