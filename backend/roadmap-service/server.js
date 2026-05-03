const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { startEureka } = require('./eureka-client');
const roadmapRoutes = require('./routes/roadmapRoutes');

const app = express();
const PORT = process.env.ROADMAP_SERVICE_PORT || 5006;

const allowedOrigins = [
  process.env.CLIENT_URL?.trim().replace(/\/$/, ''),
  'http://localhost:5173'
].filter(Boolean);

const isAllowedDevOrigin = (origin) => {
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');
};

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isAllowedDevOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
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

app.get('/roadmap/health', (req, res) => {
  res.json({ message: 'Roadmap Service is running' });
});

app.use('/roadmap', roadmapRoutes);

// ─── Global Error Handler ───

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
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
  console.log(`Roadmap Service running on port ${PORT}`);
  startEureka();
});
