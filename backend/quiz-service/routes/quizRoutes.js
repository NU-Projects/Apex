const express = require('express');

const quizController = require('../controllers/quizController');

const router = express.Router();

router.post('/generate', quizController.generateQuiz);
router.post('/pass', quizController.passQuiz);

module.exports = router;
