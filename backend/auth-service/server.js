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


// ─── Global Error Handler ───

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Handle CORS errors
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Please try again.'
    });
  }
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request format. Please try again.'
    });
  }
  
  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: 'Something went wrong. Please try again later.'
  });
});

// ─── 404 Handler ───

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Service not available. Please contact support.'
  });
});


app.listen(PORT, async () => {
  console.log(`Auth Service running on port ${PORT}`);
  startEureka();
  // await connectProducer();
});
