const axios = require('axios');

const roadmapRepository = require('../repository/roadmapRepository');

const MAX_STAGES = 10;
const PREFERRED_MAX_STAGES = 4;

const normalizeKey = (value) => String(value || '').trim().toLowerCase();

const toBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
};

const extractArrayFromText = (text) => {
  const cleanedText = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = cleanedText.indexOf('[');
  const end = cleanedText.lastIndexOf(']');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Ollama did not return a JSON array roadmap');
  }

  const jsonArrayText = cleanedText.slice(start, end + 1);
  return JSON.parse(jsonArrayText);
};

const normalizeRoadmap = (llmArray, currentSkills, missingSkills) => {
  if (!Array.isArray(llmArray)) {
    throw new Error('Roadmap response is not an array');
  }

  const currentSkillSet = new Set((currentSkills || []).map(normalizeKey));
  const missingSkillSet = new Set((missingSkills || []).map(normalizeKey));
  const missingSkillList = (missingSkills || []).map((skill) => String(skill || '').trim()).filter(Boolean);

  const prepared = llmArray
    .map((item) => ({
      stage_name: String(item?.stage_name || 'General').trim(),
      stage_order: Number.isFinite(Number(item?.stage_order)) ? Number(item.stage_order) : 1,
      skill_name: String(item?.skill_name || '').trim(),
      is_project: toBoolean(item?.is_project, false)
    }))
    .filter((item) => item.skill_name.length > 0 && item.stage_name.length > 0)
    .sort((a, b) => a.stage_order - b.stage_order || a.stage_name.localeCompare(b.stage_name));

  if (prepared.length === 0) {
    throw new Error('Roadmap response was empty after normalization');
  }

  const stageMeta = new Map();
  for (const item of prepared) {
    const key = normalizeKey(item.stage_name);
    if (!stageMeta.has(key)) {
      stageMeta.set(key, {
        originalName: item.stage_name,
        requestedOrder: item.stage_order
      });
    }
  }

  const sortedStages = [...stageMeta.entries()]
    .sort((a, b) => a[1].requestedOrder - b[1].requestedOrder || a[1].originalName.localeCompare(b[1].originalName));

  const uniqueStageCount = sortedStages.length;
  const computedTargetStages = Math.max(
    uniqueStageCount > 1 && missingSkillList.length > 0 ? 2 : 1,
    Math.min(PREFERRED_MAX_STAGES, uniqueStageCount || 1, MAX_STAGES)
  );

  const selectedStages = sortedStages.slice(0, computedTargetStages);

  const stageOrderMap = new Map();
  selectedStages.forEach(([key], index) => {
    stageOrderMap.set(key, index + 1);
  });

  const overflowStage = selectedStages[selectedStages.length - 1]?.[0] || normalizeKey('Core Skills');

  const normalized = prepared
    .map((item) => {
      const stageKey = normalizeKey(item.stage_name);
      const assignedStageKey = stageOrderMap.has(stageKey) ? stageKey : overflowStage;
      const normalizedSkill = normalizeKey(item.skill_name);
      let status = 'not_started';
      if (currentSkillSet.has(normalizedSkill)) {
        status = 'completed';
      } else if (missingSkillSet.has(normalizedSkill)) {
        status = 'not_started';
      }

      return {
        stage_name: selectedStages[(stageOrderMap.get(assignedStageKey) || 1) - 1]?.[1]?.originalName || 'Core Skills',
        stage_order: stageOrderMap.get(assignedStageKey) || 1,
        skill_name: item.skill_name,
        status,
        is_unlocked: false,
        quiz_passed: false,
        is_project: item.is_project
      };
    })
    .sort((a, b) => a.stage_order - b.stage_order || a.skill_name.localeCompare(b.skill_name));

  const deduped = [];
  const seenSkills = new Set();
  for (const item of normalized) {
    const key = normalizeKey(item.skill_name);
    if (!seenSkills.has(key)) {
      deduped.push(item);
      seenSkills.add(key);
    }
  }

  const lastStageOrder = deduped.length > 0 ? Math.max(...deduped.map((item) => item.stage_order)) : 1;
  const lastStageName = deduped.find((item) => item.stage_order === lastStageOrder)?.stage_name || 'Advanced Skills';

  // Guarantee all missing skills are covered in roadmap so completing roadmap can reduce gaps to zero.
  for (const missingSkill of missingSkillList) {
    const key = normalizeKey(missingSkill);
    if (!seenSkills.has(key)) {
      deduped.push({
        stage_name: lastStageName,
        stage_order: lastStageOrder,
        skill_name: missingSkill,
        status: 'not_started',
        is_unlocked: false,
        quiz_passed: false,
        is_project: false
      });
      seenSkills.add(key);
    }
  }

  deduped.sort((a, b) => a.stage_order - b.stage_order || a.skill_name.localeCompare(b.skill_name));

  for (const item of deduped) {
    item.is_unlocked = item.stage_order === 1;
    if (item.stage_order === 1) {
      item.is_project = false;
    }
  }

  const laterStageIndexes = deduped
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.stage_order > 1);

  if (laterStageIndexes.length > 0) {
    const currentProjectIndexes = laterStageIndexes
      .filter(({ item }) => item.is_project)
      .map(({ index }) => index);

    if (currentProjectIndexes.length === 0) {
      const lastLater = laterStageIndexes[laterStageIndexes.length - 1];
      deduped[lastLater.index].is_project = true;
    }

    if (currentProjectIndexes.length > 2) {
      const keep = new Set(currentProjectIndexes.slice(0, 2));
      currentProjectIndexes.slice(2).forEach((idx) => {
        if (!keep.has(idx)) {
          deduped[idx].is_project = false;
        }
      });
    }
  }

  return deduped;
};

const buildPrompt = ({ role, currentSkills, missingSkills }) => {
  const currentSkillsText = (currentSkills || []).join(', ') || 'None';
  const missingSkillsText = (missingSkills || []).join(', ') || 'None';

  return `You are an expert career roadmap generator.

Generate a structured learning roadmap in JSON format based on:

Target Role: ${role}
Current Skills: ${currentSkillsText}
Missing Skills: ${missingSkillsText}

Rules:
1. Break the roadmap into stages (e.g., Fundamentals, Frontend, Backend, Database, DevOps, System Design).
2. Each stage must have:
   - stage_name
   - stage_order (starting from 1)
3. Each stage contains multiple skills.
4. Include both missing skills AND relevant important skills for the role.
5. Mark skills:
   - If skill is in Current Skills -> status = "completed"
   - If skill is in Missing Skills -> status = "not_started"
   - Otherwise -> status = "not_started"
6. Only first stage should have is_unlocked = true, others false.
7. quiz_passed = false for all
8. Add 1-2 project items (is_project = true) in later stages.
9. Keep skill names short and standard (e.g., "Node.js", "Docker", "REST API").
10. Output MUST be a flat JSON array (no nesting).
11. Minimize the number of stages as much as possible while keeping a clean progression.
12. Use at most 10 stages.
13. Every item from Missing Skills must appear at least once in the roadmap.

Output format (STRICT):
[
  {
    "stage_name": "Frontend",
    "stage_order": 1,
    "skill_name": "HTML",
    "status": "completed",
    "is_unlocked": true,
    "quiz_passed": false,
    "is_project": false
  }
]

Return only valid JSON, no markdown and no explanation.`;
};

const callOllamaRoadmap = async ({ role, currentSkills, missingSkills }) => {
  const generateUrl = process.env.OLLAMA_GENERATE_URL
    || `${(process.env.OLLAMA_BASE_URL || 'https://ollama.com').replace(/\/$/, '')}/api/generate`;

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.OLLAMA_API_KEY) {
    headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
  }

  const response = await axios.post(
    generateUrl,
    {
      model: process.env.OLLAMA_MODEL,
      prompt: buildPrompt({ role, currentSkills, missingSkills }),
      stream: false
    },
    {
      headers,
      timeout: 90000
    }
  );

  const llmText = response?.data?.response;
  if (!llmText) {
    throw new Error('Ollama response is empty');
  }

  const llmArray = extractArrayFromText(llmText);
  return normalizeRoadmap(llmArray, currentSkills, missingSkills);
};

const generateAndStoreRoadmap = async (email) => {
  const user = await roadmapRepository.getUserRoadmapInputs(email);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const role = user.role;
  const currentSkills = Array.isArray(user.skills) ? user.skills : [];
  const missingSkills = Array.isArray(user.missing_skills) ? user.missing_skills : [];

  if (!role) {
    const err = new Error('User role is required to generate roadmap');
    err.statusCode = 400;
    throw err;
  }

  const roadmap = await callOllamaRoadmap({
    role,
    currentSkills,
    missingSkills
  });

  const savedRoadmap = await roadmapRepository.replaceUserRoadmap(email, role, roadmap);

  return {
    email,
    role,
    roadmap: savedRoadmap
  };
};

module.exports = {
  generateAndStoreRoadmap
};
