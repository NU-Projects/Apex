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

  // Try to find JSON array boundaries
  const start = cleanedText.indexOf('[');
  const end = cleanedText.lastIndexOf(']');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Ollama did not return a valid JSON array for the quiz');
  }

  let jsonArrayText = cleanedText.slice(start, end + 1);
  
  // Clean up common JSON issues
  // Fix trailing commas before closing brackets
  jsonArrayText = jsonArrayText.replace(/,(\s*[}\]])/g, '$1');
  // Fix missing commas between objects
  jsonArrayText = jsonArrayText.replace(/}\s*{/g, '},{');
  // Remove any control characters
  jsonArrayText = jsonArrayText.replace(/[\x00-\x1F\x7F]/g, '');
  
  try {
    return JSON.parse(jsonArrayText);
  } catch (parseError) {
    // If parsing fails, try to provide more context
    const errorPos = parseError.message.match(/position (\d+)/);
    if (errorPos) {
      const pos = parseInt(errorPos[1]);
      const context = jsonArrayText.substring(Math.max(0, pos - 50), Math.min(jsonArrayText.length, pos + 50));
      throw new Error(`Invalid JSON at position ${pos}. Context: ...${context}...`);
    }
    throw new Error(`Failed to parse quiz JSON: ${parseError.message}`);
  }
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
    .map((item, index) => {
      const statement = item.statement.trim();
      const options = item.options.map((opt) => String(opt).trim());
      let correctOption = item.correct_option.trim();

      // Validate that correct_option exists in options array
      // Try exact match first
      let matchIndex = options.findIndex(opt => opt === correctOption);
      
      // If no exact match, try case-insensitive
      if (matchIndex === -1) {
        matchIndex = options.findIndex(opt => 
          opt.toLowerCase() === correctOption.toLowerCase()
        );
        if (matchIndex !== -1) {
          correctOption = options[matchIndex]; // Use the exact text from options
        }
      }

      // If still no match, check if it's a letter (A, B, C, D)
      if (matchIndex === -1) {
        const upperCorrect = correctOption.toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(upperCorrect)) {
          const letterIndex = ['A', 'B', 'C', 'D'].indexOf(upperCorrect);
          correctOption = options[letterIndex];
          matchIndex = letterIndex;
        }
      }

      // If STILL no match, default to first option
      if (matchIndex === -1) {
        console.warn(`[Quiz] Invalid correct_option "${correctOption}" for question "${statement}". Defaulting to first option.`);
        correctOption = options[0];
      }

      return {
        id: index + 1,
        statement,
        options,
        correct_option: correctOption
      };
    });

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
1. Difficulty level must be medium — not too easy, not too hard.
2. Each question must have:
   - "statement": the question text
   - "options": an array of exactly 4 answer choices (strings)
   - "correct_option": the EXACT TEXT of the correct answer from the options array
3. All 4 options must be plausible; avoid obviously wrong fillers.
4. Cover different sub-topics within "${title}" for variety.
5. Output MUST be a flat JSON array of 10 objects.
6. Do NOT include any markdown, explanation, or text outside the JSON.
7. IMPORTANT: "correct_option" must be the complete text of one of the options, NOT a letter like "A" or "B".

Example format:
[
  {
    "statement": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correct_option": "Paris"
  }
]

Return ONLY valid JSON, no markdown and no explanation.`;
};

/**
 * Call the Ollama API and return 10 normalised MCQs.
 */
const callOllamaQuiz = async (title) => {
  // Check if using local Ollama
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const isLocal = ollamaBaseUrl.includes('localhost') || ollamaBaseUrl.includes('127.0.0.1');
  
  const generateUrl = `${ollamaBaseUrl}/api/generate`;

  const headers = { 'Content-Type': 'application/json' };
  // Only add auth for cloud Ollama
  if (process.env.OLLAMA_API_KEY && !isLocal) {
    headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
  }

  const ollamaTimeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS) || 180000; // 3 min default

  const response = await axios.post(
    generateUrl,
    {
      model: process.env.OLLAMA_MODEL || 'llama2',
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
