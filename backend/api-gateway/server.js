const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { startEureka } = require('./eureka-client');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const SERVICES = {
  users: 'http://user-service:5005',
  notifications: 'http://notification-service:5003',
  eureka: 'http://netflix-eureka-server:5002'
};

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway Service is running' });
});

// Route: /u -> user-service (exact match)
app.all('/u', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.users}/u`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

//u means users
// Route: /u/* -> user-service
app.all('/u/{*path}', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.users}${req.path}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /notifications -> notification-service (exact match)
app.all('/notifications', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.notifications}/notifications`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /notifications/* -> notification-service
app.all('/notifications/{*path}', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.notifications}${req.path}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /eureka -> netflix-eureka-server (exact match)
app.all('/eureka', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.eureka}/eureka`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /eureka/* -> netflix-eureka-server
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
