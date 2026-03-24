const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { startEureka } = require('./eureka-client');
// const { connectProducer, sendMessage } = require('./kafka-producer');

const authRoutes = require('./routes/authRoutes');

const cors = require('cors');

const app = express();
const PORT = process.env.AUTHSERVICE_PORT || 5002;

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


// ─── Health check ───

app.get('/auth', (req, res) => {
  res.json({ message: 'Auth Service is running' });
});


// ─── Routes ───

app.use('/auth', authRoutes);


app.listen(PORT, async () => {
  console.log(`Auth Service running on port ${PORT}`);
  // startEureka();
  // await connectProducer();
});
