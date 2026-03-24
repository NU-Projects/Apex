const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const { startEureka } = require('./eureka-client');

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 5005;

const allowedOrigins = [
  process.env.CLIENT_URL?.trim().replace(/\/$/, ""),
  "http://localhost:5173"
].filter(Boolean);

const isAllowedDevOrigin = (origin) => {
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');
};

const corsOptions = {
  origin: (origin, callback) => {
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

app.get('/user', (req, res) => {
  res.json({ message: 'User Service is running' });
});

app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
  // startEureka();
});
