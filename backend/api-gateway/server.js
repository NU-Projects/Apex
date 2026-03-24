const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { startEureka } = require('./eureka-client');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL?.trim().replace(/\/$/, ""),
  "http://localhost:5173"
].filter(Boolean);

const isAllowedDevOrigin = (origin) => {
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');
};

const corsOptions = {
  origin: (origin, callback) => {
    // console.log("Incoming origin:", origin);
    if (!origin || allowedOrigins.includes(origin) || isAllowedDevOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5002',
  eureka: process.env.EUREKA_SERVER_URL || 'http://localhost:5001',
  skills: process.env.SKILLS_EXTRACTION_SERVICE_URL || 'http://localhost:5003',
  jobs: process.env.JOB_SERVICE_URL || 'http://localhost:5004',
  user: process.env.USER_SERVICE_URL || 'http://localhost:5005',
  roadmap: process.env.ROADMAP_SERVICE_URL || 'http://localhost:5006'
};

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway Service is running' });
});


// Route: /auth* -> auth-service
app.use('/auth', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.auth}/auth${req.url}`,
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
app.use('/eureka', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.eureka}/eureka${req.url}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /skills* -> skills-extraction-service
app.use('/skills', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.skills}${req.url}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /jobs* -> job-service
app.use('/jobs', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.jobs}/jobs${req.url}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /user* -> user-service
app.use('/user', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.user}/user${req.url}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Route: /roadmap* -> roadmap-service
app.use('/roadmap', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.roadmap}/roadmap${req.url}`,
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
