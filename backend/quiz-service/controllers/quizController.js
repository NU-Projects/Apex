const quizService = require('../services/quizService');

const generateQuiz = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a valid topic for the quiz.' 
      });
    }

    console.log(`[Quiz] Generating quiz for topic: ${title}`);
    const result = await quizService.generateQuiz(title.trim());
    console.log(`[Quiz] Successfully generated ${result.quiz.length} questions`);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[Quiz] Generation failed:', error.message);
    const statusCode = error.statusCode || 500;
    const userMessage = statusCode === 500 
      ? 'Unable to generate quiz. Please try again later.' 
      : error.message;
    return res.status(statusCode).json({ 
      success: false,
      error: userMessage 
    });
  }
};

const passQuiz = async (req, res) => {
  try {
    const { email, title } = req.body;

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required to save your progress.' 
      });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Quiz topic is required.' 
      });
    }

    const result = await quizService.passQuiz(email.trim(), title.trim());
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const userMessage = statusCode === 500 
      ? 'Unable to save quiz progress. Please try again later.' 
      : error.message;
    return res.status(statusCode).json({ 
      success: false,
      error: userMessage 
    });
  }
};

module.exports = {
  generateQuiz,
  passQuiz
};
