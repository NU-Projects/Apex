const supabase = require('../config/supabase');

/**
 * Fetch a user's current skills and missing_skills arrays.
 */
const getUserSkills = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('email, skills, missing_skills')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    const err = new Error(`Failed to fetch user: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }

  return data;
};

/**
 * Remove a skill from missing_skills and add it to skills for the given user.
 */
const moveSkillToCurrent = async (email, currentSkills, missingSkills) => {
  const { error } = await supabase
    .from('users')
    .update({
      skills: currentSkills,
      missing_skills: missingSkills
    })
    .eq('email', email);

  if (error) {
    const err = new Error(`Failed to update user skills: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Mark quiz_passed = true in user_roadmap for a specific email + skill_name.
 */
const markQuizPassed = async (email, skillName) => {
  const { error } = await supabase
    .from('user_roadmap')
    .update({ quiz_passed: true })
    .eq('email', email)
    .ilike('skill_name', skillName);

  if (error) {
    const err = new Error(`Failed to update roadmap quiz status: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Get user's complete roadmap with all stages and skills.
 */
const getUserRoadmap = async (email) => {
  const { data, error } = await supabase
    .from('user_roadmap')
    .select('email, role, stage_name, stage_order, skill_name, status, is_unlocked, quiz_passed')
    .eq('email', email)
    .order('stage_order', { ascending: true })
    .order('skill_name', { ascending: true });

  if (error) {
    const err = new Error(`Failed to fetch user roadmap: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }

  return data || [];
};

/**
 * Unlock all skills in a specific stage.
 */
const unlockStage = async (email, stageOrder) => {
  const { error } = await supabase
    .from('user_roadmap')
    .update({ is_unlocked: true })
    .eq('email', email)
    .eq('stage_order', stageOrder);

  if (error) {
    const err = new Error(`Failed to unlock stage: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }
};

module.exports = {
  getUserSkills,
  moveSkillToCurrent,
  markQuizPassed,
  getUserRoadmap,
  unlockStage
};
