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

app.get('/roadmap', (req, res) => {
  res.json({ message: 'Roadmap Service is running' });
});

app.use('/roadmap', roadmapRoutes);

app.listen(PORT, () => {
  console.log(`Roadmap Service running on port ${PORT}`);
  startEureka();
});
