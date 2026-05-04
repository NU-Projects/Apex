const axios = require('axios');

const roadmapRepository = require('../repository/roadmapRepository');

const MAX_STAGES = 10;
const PREFERRED_MAX_STAGES = 4;

const normalizeKey = (value) => String(value || '').trim().toLowerCase();

const extractArrayFromText = (text) => {
  const cleanedText = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = cleanedText.indexOf('[');
  const end = cleanedText.lastIndexOf(']');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Groq did not return a JSON array roadmap');
  }

  const jsonArrayText = cleanedText.slice(start, end + 1);
  return JSON.parse(jsonArrayText);
};

const normalizeRoadmap = (llmArray, currentSkills, missingSkills) => {
  if (!Array.isArray(llmArray)) {
    throw new Error('Roadmap response is not an array');
  }

  const currentSkillSet = new Set((currentSkills || []).map(normalizeKey));
  const missingSkillList = (missingSkills || []).map((skill) => String(skill || '').trim()).filter(Boolean);

  const prepared = llmArray
    .map((item) => ({
      stage_name: String(item?.stage_name || 'General').trim(),
      stage_order: Number.isFinite(Number(item?.stage_order)) ? Number(item.stage_order) : 1,
      skill_name: String(item?.skill_name || '').trim()
    }))
    .filter((item) => item.skill_name.length > 0 && item.stage_name.length > 0)
    // Keep roadmap focused on learning gaps only.
    .filter((item) => !currentSkillSet.has(normalizeKey(item.skill_name)))
    .sort((a, b) => a.stage_order - b.stage_order || a.stage_name.localeCompare(b.stage_name));

  const sourceItems = prepared.length > 0 ? prepared : [];

  if (sourceItems.length === 0 && missingSkillList.length === 0) {
    return [];
  }

  const effectiveSourceItems = sourceItems.length > 0
    ? sourceItems
    : [{
      stage_name: 'Core Skills',
      stage_order: 1,
      skill_name: missingSkillList[0]
    }];

  const stageMeta = new Map();
  for (const item of effectiveSourceItems) {
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

  const normalized = effectiveSourceItems
    .map((item) => {
      const stageKey = normalizeKey(item.stage_name);
      const assignedStageKey = stageOrderMap.has(stageKey) ? stageKey : overflowStage;

      return {
        stage_name: selectedStages[(stageOrderMap.get(assignedStageKey) || 1) - 1]?.[1]?.originalName || 'Core Skills',
        stage_order: stageOrderMap.get(assignedStageKey) || 1,
        skill_name: item.skill_name,
        status: 'not_started',
        is_unlocked: false,
        quiz_passed: false
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
        quiz_passed: false
      });
      seenSkills.add(key);
    }
  }

  deduped.sort((a, b) => a.stage_order - b.stage_order || a.skill_name.localeCompare(b.skill_name));

  for (const item of deduped) {
    item.is_unlocked = item.stage_order === 1;
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
4. Include only skills that the user still needs to learn.
5. Mark skills:
  - Every roadmap skill must be status = "not_started"
6. Never include skills already present in Current Skills.
7. Only first stage should have is_unlocked = true, others false.
8. quiz_passed = false for all
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
    "status": "not_started",
    "is_unlocked": true,
    "quiz_passed": false
  }
]

Return only valid JSON, no markdown and no explanation.`;
};

const callGroqRoadmap = async ({ role, currentSkills, missingSkills }) => {
  const groqApiKey = process.env.GROQ_API;
  
  if (!groqApiKey) {
    throw new Error('GROQ_API key is missing in .env');
  }

  const generateUrl = 'https://api.groq.com/openai/v1/chat/completions';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${groqApiKey}`
  };

  const groqTimeoutMs = Number(process.env.GROQ_TIMEOUT_MS) || 30000; // 30 sec default

  const response = await axios.post(
    generateUrl,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a career roadmap generator. Return ONLY a valid JSON array.'
        },
        {
          role: 'user',
          content: buildPrompt({ role, currentSkills, missingSkills })
        }
      ],
      temperature: 0.3,  // Lower temperature for consistent, structured output
      max_tokens: 4000
    },
    {
      headers,
      timeout: groqTimeoutMs
    }
  );

  const llmText = response?.data?.choices?.[0]?.message?.content;
  if (!llmText) {
    throw new Error('Groq response is empty');
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

  if (missingSkills.length === 0) {
    const savedRoadmap = await roadmapRepository.replaceUserRoadmap(email, role, []);
    return {
      email,
      role,
      roadmap: savedRoadmap
    };
  }

  const roadmap = await callGroqRoadmap({
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

const getStoredRoadmap = async (email) => {
  const user = await roadmapRepository.getUserRoadmapInputs(email);
  const roadmap = await roadmapRepository.getUserRoadmapByEmail(email);

  return {
    email,
    role: user?.role || roadmap?.[0]?.role || 'Learning Roadmap',
    roadmap
  };
};

const updateSkillStatus = async (email, skillName, status) => {
  if (!email || !skillName || !status) {
    const err = new Error('email, skill_name, and status are all required');
    err.statusCode = 400;
    throw err;
  }

  const updated = await roadmapRepository.updateSkillStatus(email, skillName, status);
  return updated;
};

module.exports = {
  generateAndStoreRoadmap,
  getStoredRoadmap,
  updateSkillStatus
};
