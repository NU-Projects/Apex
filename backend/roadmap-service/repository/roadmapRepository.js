const supabase = require('../config/supabase');

const getUserRoadmapInputs = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('email, role, skills, missing_skills')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    const err = new Error(`Failed to fetch user by email: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }

  return data;
};

const replaceUserRoadmap = async (email, role, roadmapRows) => {
  const { error: deleteError } = await supabase
    .from('user_roadmap')
    .delete()
    .eq('email', email)
    .eq('role', role);

  if (deleteError) {
    const err = new Error(`Failed to clear previous roadmap: ${deleteError.message}`);
    err.statusCode = 500;
    throw err;
  }

  const rowsToInsert = roadmapRows.map((row) => ({
    email,
    role,
    stage_name: row.stage_name,
    stage_order: row.stage_order,
    skill_name: row.skill_name,
    status: row.status,
    is_unlocked: row.is_unlocked,
    quiz_passed: row.quiz_passed
  }));

  if (rowsToInsert.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_roadmap')
    .insert(rowsToInsert)
    .select('email, role, stage_name, stage_order, skill_name, status, is_unlocked, quiz_passed');

  if (error) {
    const err = new Error(`Failed to save roadmap: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }

  return (data || []).sort((a, b) => a.stage_order - b.stage_order || a.skill_name.localeCompare(b.skill_name));
};

module.exports = {
  getUserRoadmapInputs,
  replaceUserRoadmap
};
