const pool = require('../config/db');

const getUserProfile = async (email) => {
  const query = 'SELECT email, full_name, github_username, linkedin_username, role, skills, missing_skills FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
};

const updateUserProfile = async (email, updates) => {
  const fields = [];
  const values = [email];
  let idx = 2;

  if (updates.full_name !== undefined) {
    fields.push(`full_name = $${idx++}`);
    values.push(updates.full_name);
  }
  if (updates.password !== undefined) {
    fields.push(`password = $${idx++}`);
    values.push(updates.password);
  }
  if (updates.role !== undefined) {
    fields.push(`role = $${idx++}`);
    values.push(updates.role);
  }
  if (updates.github_username !== undefined) {
    fields.push(`github_username = $${idx++}`);
    values.push(updates.github_username);
  }
  if (updates.linkedin_username !== undefined) {
    fields.push(`linkedin_username = $${idx++}`);
    values.push(updates.linkedin_username);
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE users 
    SET ${fields.join(', ')} 
    WHERE email = $1 
    RETURNING email, full_name, github_username, linkedin_username, role, missing_skills
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

const updateUserSkills = async (email, skills) => {
  const query = `UPDATE users SET skills = $2 WHERE email = $1 RETURNING skills`;
  const { rows } = await pool.query(query, [email, skills]);
  return rows[0] || null;
}

const updateUserMissingSkills = async (email, missing_skills) => {
  const query = `UPDATE users SET missing_skills = $2 WHERE email = $1 RETURNING missing_skills`;
  const { rows } = await pool.query(query, [email, missing_skills]);
  return rows[0] || null;
}

module.exports = { getUserProfile, updateUserProfile, updateUserSkills, updateUserMissingSkills };
