const express = require('express');

const roadmapController = require('../controllers/roadmapController');

const router = express.Router();

router.get('/', roadmapController.getRoadmapByEmail);
router.post('/generate', roadmapController.generateRoadmapByEmail);

module.exports = router;
