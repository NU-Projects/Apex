const quizService = require('../services/quizService');

const generateQuiz = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await quizService.generateQuiz(title.trim());
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to generate quiz' });
  }
};

const passQuiz = async (req, res) => {
  try {
    const { email, title } = req.body;

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await quizService.passQuiz(email.trim(), title.trim());
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to process quiz pass' });
  }
};

module.exports = {
  generateQuiz,
  passQuiz
};
