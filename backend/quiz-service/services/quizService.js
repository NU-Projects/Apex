const axios = require('axios');
const quizRepository = require('../repository/quizRepository');

/**
 * Extract a JSON array from raw LLM text that may contain markdown fences.
 */
const extractArrayFromText = (text) => {
  const cleanedText = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = cleanedText.indexOf('[');
  const end = cleanedText.lastIndexOf(']');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Ollama did not return a valid JSON array for the quiz');
  }

  const jsonArrayText = cleanedText.slice(start, end + 1);
  return JSON.parse(jsonArrayText);
};

/**
 * Validate and normalise the quiz array coming from the LLM.
 * Ensures exactly 10 MCQs with the expected shape.
 */
const normalizeQuiz = (llmArray) => {
  if (!Array.isArray(llmArray)) {
    throw new Error('Quiz response is not an array');
  }

  const normalized = llmArray
    .filter((item) => {
      return (
        item &&
        typeof item.statement === 'string' &&
        Array.isArray(item.options) &&
        item.options.length === 4 &&
        typeof item.correct_option === 'string'
      );
    })
    .map((item, index) => ({
      id: index + 1,
      statement: item.statement.trim(),
      options: item.options.map((opt) => String(opt).trim()),
      correct_option: item.correct_option.trim()
    }));

  if (normalized.length < 10) {
    throw new Error(
      `Expected 10 MCQs but Ollama returned only ${normalized.length} valid questions`
    );
  }

  return normalized.slice(0, 10);
};

/**
 * Build the prompt that instructs Ollama to produce exactly 10 MCQs.
 */
const buildPrompt = (title) => {
  return `You are an expert quiz generator.

Generate exactly 10 multiple choice questions (MCQs) on the topic: "${title}".

Rules:
1. Difficulty level must be medium / mediocre — not too easy, not too hard.
2. Each question must have:
   - "statement": the question text
   - "options": an array of exactly 4 answer choices (strings)
   - "correct_option": the correct answer (must exactly match one of the 4 options)
3. All 4 options must be plausible; avoid obviously wrong fillers.
4. Cover different sub-topics within "${title}" for variety.
5. Output MUST be a flat JSON array of 10 objects.
6. Do NOT include any markdown, explanation, or text outside the JSON.

Output format (STRICT):
[
  {
    "statement": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_option": "Option B"
  }
]

Return ONLY valid JSON, no markdown and no explanation.`;
};

/**
 * Call the Ollama API and return 10 normalised MCQs.
 */
const callOllamaQuiz = async (title) => {
  const generateUrl = 'https://ollama.com/api/generate';

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.OLLAMA_API_KEY) {
    headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
  }

  const ollamaTimeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS) || 180000; // 3 min default

  const response = await axios.post(
    generateUrl,
    {
      model: process.env.OLLAMA_MODEL,
      prompt: buildPrompt(title),
      stream: false
    },
    {
      headers,
      timeout: ollamaTimeoutMs
    }
  );

  const llmText = response?.data?.response;
  if (!llmText) {
    throw new Error('Ollama response is empty');
  }

  const llmArray = extractArrayFromText(llmText);
  return normalizeQuiz(llmArray);
};

/**
 * Public entry-point: generate a quiz for the given topic title.
 */
const generateQuiz = async (title) => {
  const quiz = await callOllamaQuiz(title);

  return {
    title,
    total_questions: quiz.length,
    quiz
  };
};

/**
 * Mark a quiz as passed:
 * 1. If title exists in user's missing_skills -> remove from missing_skills, add to skills
 * 2. Mark quiz_passed = true in user_roadmap for that skill_name + email
 */
const passQuiz = async (email, title) => {
  // Fetch current user skills
  const user = await quizRepository.getUserSkills(email);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const currentSkills = Array.isArray(user.skills) ? user.skills : [];
  const missingSkills = Array.isArray(user.missing_skills) ? user.missing_skills : [];

  // Case-insensitive check for the title in missing_skills
  const normalizedTitle = title.toLowerCase().trim();
  const missingIndex = missingSkills.findIndex(
    (skill) => String(skill).toLowerCase().trim() === normalizedTitle
  );

  if (missingIndex !== -1) {
    // Remove from missing_skills
    const removedSkill = missingSkills.splice(missingIndex, 1)[0];

    // Add to current skills if not already present
    const alreadyHas = currentSkills.some(
      (skill) => String(skill).toLowerCase().trim() === normalizedTitle
    );
    if (!alreadyHas) {
      currentSkills.push(removedSkill);
    }

    // Update the user record
    await quizRepository.moveSkillToCurrent(email, currentSkills, missingSkills);
  }

  // Mark quiz_passed = true in user_roadmap regardless
  await quizRepository.markQuizPassed(email, title);

  return { message: 'Quiz passed successfully' };
};

module.exports = {
  generateQuiz,
  passQuiz
};
