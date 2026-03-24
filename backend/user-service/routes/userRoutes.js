const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/profile', userController.updateProfile);
router.post('/fetch-skills', userController.triggerSkillExtraction);
router.post('/missing-skills', userController.recomputeMissingSkills);

module.exports = router;
