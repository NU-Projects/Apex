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

const getRoadmapByEmail = async (req, res) => {
  try {
    const email = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await roadmapService.getStoredRoadmap(email);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to fetch roadmap' });
  }
};

const updateSkillStatus = async (req, res) => {
  try {
    const { email, skill_name, status } = req.body;

    if (!email || !skill_name || !status) {
      return res.status(400).json({ error: 'email, skill_name, and status are required' });
    }

    const result = await roadmapService.updateSkillStatus(email, skill_name, status);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to update skill status' });
  }
};

module.exports = {
  generateRoadmapByEmail,
  getRoadmapByEmail,
  updateSkillStatus
};
