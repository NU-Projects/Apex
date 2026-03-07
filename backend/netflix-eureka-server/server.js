const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { setupEurekaRoutes } = require('./eureka-server');

const app = express();
const PORT = process.env.EUREKA_PORT || 5001;

app.use(express.json());

setupEurekaRoutes(app);

app.listen(PORT, () => {
  console.log(`Netflix Eureka Server running on port ${PORT}`);
});
