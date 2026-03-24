const roadmapService = require('../services/roadmapService');

const generateRoadmapByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await roadmapService.generateAndStoreRoadmap(email);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to generate roadmap' });
  }
};

module.exports = {
  generateRoadmapByEmail
};
