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
  roadmap: process.env.ROADMAP_SERVICE_URL || 'http://localhost:5006',
  quiz: process.env.QUIZ_SERVICE_URL || 'http://localhost:5007'
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
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        success: false, 
        message: 'Authentication service is temporarily unavailable. Please try again later.' 
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { 
        success: false, 
        message: 'Something went wrong. Please try again later.' 
      }
    );
  }
});

// Route: /eureka* -> netflix-eureka-server
app.use('/eureka', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.eureka}/eureka${req.url}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        success: false, 
        error: 'Service discovery is temporarily unavailable. Please try again later.' 
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { 
        success: false, 
        error: 'Something went wrong. Please try again later.' 
      }
    );
  }
});

// Route: /skills* -> skills-extraction-service
app.use('/skills', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.skills}${req.url}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        success: false, 
        error: 'Skills service is temporarily unavailable. Please try again later.' 
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { 
        success: false, 
        error: 'Something went wrong. Please try again later.' 
      }
    );
  }
});

// Route: /jobs* -> job-service
app.use('/jobs', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.jobs}/jobs${req.url}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        success: false, 
        error: 'Jobs service is temporarily unavailable. Please try again later.' 
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { 
        success: false, 
        error: 'Something went wrong. Please try again later.' 
      }
    );
  }
});

// Route: /user* -> user-service
app.use('/user', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.user}/user${req.url}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        success: false, 
        error: 'User service is temporarily unavailable. Please try again later.' 
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { 
        success: false, 
        error: 'Something went wrong. Please try again later.' 
      }
    );
  }
});

// Route: /roadmap* -> roadmap-service
app.use('/roadmap', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.roadmap}/roadmap${req.url}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        success: false, 
        error: 'Roadmap service is temporarily unavailable. Please try again later.' 
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { 
        success: false, 
        error: 'Something went wrong. Please try again later.' 
      }
    );
  }
});

// Route: /quiz* -> quiz-service
app.use('/quiz', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SERVICES.quiz}/quiz${req.url}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        success: false, 
        error: 'Quiz service is temporarily unavailable. Please try again later.' 
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { 
        success: false, 
        error: 'Something went wrong. Please try again later.' 
      }
    );
  }
});

// ─── Global Error Handler ───

app.use((err, req, res, next) => {
  console.error('API Gateway Error:', err.message);
  
  // Handle CORS errors
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Please try again.'
    });
  }
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request format. Please try again.'
    });
  }
  
  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: 'Something went wrong. Please try again later.'
  });
});

// ─── 404 Handler ───

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Service not available. Please contact support.'
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  startEureka();
});
