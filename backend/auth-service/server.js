const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { startEureka } = require('./eureka-client');
// const { connectProducer, sendMessage } = require('./kafka-producer');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.AUTHSERVICE_PORT || 5002;

app.use(express.json());


// ─── Health check ───

app.get('/auth', (req, res) => {
  res.json({ message: 'Auth Service is running' });
});


// ─── Routes ───

app.use('/auth', authRoutes);


app.listen(PORT, async () => {
  console.log(`Auth Service running on port ${PORT}`);
  startEureka();
  // await connectProducer();
});
