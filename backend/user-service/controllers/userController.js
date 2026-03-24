const userRepository = require('../repository/userRepository');
const bcrypt = require('bcrypt');
const axios = require('axios');

const { eurekaClient } = require('../eureka-client');

const getSkillsServiceUrl = () => {
  if (eurekaClient) {
    const instances = eurekaClient.getInstancesByAppId('SKILLS-EXTRACTION-SERVICE');
    if (instances && instances.length > 0) {
      const instance = instances[0];
      return `http://${instance.hostName}:${instance.port.$}`;
    }
  }
  return process.env.SKILLS_EXTRACTION_SERVICE_URL || 'http://localhost:5003';
};

const updateProfile = async (req, res) => {
  try {
    const { email, full_name, password, role, github_username, linkedin_username } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required to identify user' });
    }

    const currentUser = await userRepository.getUserProfile(email);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (role !== undefined) updates.role = role;

    const extractUsername = (val) => {
      if (!val) return val;
      if (val.includes('/')) {
        const parts = val.split('/').filter(Boolean);
        return parts[parts.length - 1];
      }
      return val;
    };

    if (github_username !== undefined) updates.github_username = extractUsername(github_username);
    if (linkedin_username !== undefined) updates.linkedin_username = extractUsername(linkedin_username);
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Perform database update first
    const updatedUserBase = await userRepository.updateUserProfile(email, updates);

    // Now definitely trigger skill extraction if role or social handles are provided/present
    const finalGithub = updates.github_username !== undefined ? updates.github_username : currentUser.github_username;
    const finalLinkedin = updates.linkedin_username !== undefined ? updates.linkedin_username : currentUser.linkedin_username;
    const finalRole = updates.role !== undefined ? updates.role : currentUser.role;

    // We only trigger if at least one social handle exists
    if (finalGithub || finalLinkedin) {
      const skillsUrl = getSkillsServiceUrl();
      console.log(`Triggering skill extraction for ${email} at ${skillsUrl}`);
      
      try {
        // Significantly increased timeout to 90 seconds (extraction and scraping can take time)
        const skillsRes = await axios.post(`${skillsUrl}/all-skills`, {
          github_username: finalGithub,
          linkedin_username: finalLinkedin
        }, { timeout: 90000 });
        
        const newSkills = skillsRes.data;
        if (Array.isArray(newSkills)) {
          // Merge with existing skills (avoid duplicates)
          const existingSkills = currentUser.skills || [];
          const mergedSkills = [...new Set([...existingSkills, ...newSkills])];
          
          await userRepository.updateUserSkills(email, mergedSkills);
          
          if (finalRole) {
            const msRes = await axios.post(`${skillsUrl}/missing-skills`, {
              role: finalRole,
              currentSkills: mergedSkills
            }, { timeout: 90000 });
            
            const missingSkills = msRes.data;
            if (Array.isArray(missingSkills)) {
              await userRepository.updateUserMissingSkills(email, missingSkills);
            }
          }
        }
      } catch (e) {
        console.error('Skill automated fetch failed during profile update:', e.message);
      }
    } else if (updates.role !== undefined && updates.role !== currentUser.role && currentUser.skills) {
      // Role changed, recompute missing skills using existing skills
      const skillsUrl = getSkillsServiceUrl();
      try {
        const msRes = await axios.post(`${skillsUrl}/missing-skills`, {
          role: updates.role,
          currentSkills: currentUser.skills
        }, { timeout: 90000 });
        
        const missingSkills = msRes.data;
        if (Array.isArray(missingSkills)) {
          await userRepository.updateUserMissingSkills(email, missingSkills);
        }
      } catch (e) {
        console.error('Missing skills re-computation failed:', e.message);
      }
    }

    // Fetch the final state of the user for response
    const finalUser = await userRepository.getUserProfile(email);
    return res.status(200).json({ message: 'Profile updated successfully', user: finalUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const triggerSkillExtraction = async (req, res) => {
  try {
    const { email, github_username, linkedin_username } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await userRepository.getUserProfile(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const gUsername = github_username !== undefined ? github_username : user.github_username;
    const lUsername = linkedin_username !== undefined ? linkedin_username : user.linkedin_username;

    const skillsUrl = getSkillsServiceUrl();
    const response = await axios.post(`${skillsUrl}/all-skills`, {
      github_username: gUsername,
      linkedin_username: lUsername
    });

    const newSkills = response.data;
    if (Array.isArray(newSkills)) {
      await userRepository.updateUserSkills(email, newSkills);

      let missingSkills = [];
      if (user.role) {
        try {
          const msRes = await axios.post(`${skillsUrl}/missing-skills`, {
            role: user.role,
            currentSkills: newSkills
          });
          missingSkills = msRes.data;
          if (Array.isArray(missingSkills)) {
            await userRepository.updateUserMissingSkills(email, missingSkills);
          }
        } catch(e) {
          console.error('Failed to get missing skills manually:', e.message);
        }
      }

      return res.json({ 
        message: 'Skills fetched and updated successfully', 
        skills: newSkills,
        missing_skills: missingSkills
      });
    }
    
    return res.status(400).json({ error: 'Invalid response from skill extraction service' });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

module.exports = { updateProfile, triggerSkillExtraction };
