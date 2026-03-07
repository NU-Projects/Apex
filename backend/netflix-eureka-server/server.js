const express = require('express');
require('dotenv').config();
const { setupEurekaRoutes } = require('./eureka-server');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

setupEurekaRoutes(app);

app.listen(PORT, () => {
  console.log(`Netflix Eureka Server running on port ${PORT}`);
});
