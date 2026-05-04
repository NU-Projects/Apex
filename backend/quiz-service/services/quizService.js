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
    throw new Error('Groq did not return a valid JSON array for the quiz');
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
      `Expected 10 MCQs but Groq returned only ${normalized.length} valid questions`
    );
  }

  return normalized.slice(0, 10);
};

/**
 * Build the prompt that instructs Groq to produce exactly 10 unique MCQs.
 */
const buildPrompt = (title) => {
  return `You are an expert quiz generator.

Generate exactly 10 UNIQUE multiple choice questions (MCQs) on the topic: "${title}".

IMPORTANT: Generate DIFFERENT questions each time, even for the same topic. Vary difficulty, focus areas, and question styles.

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
 * Call the Groq API and return 10 normalised MCQs with randomness.
 */
const callGroqQuiz = async (title) => {
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

  // Add randomness: use current timestamp and random seed for unique questions each time
  const randomSeed = Math.floor(Math.random() * 10000);
  const timestamp = Date.now();
  
  const response = await axios.post(
    generateUrl,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator. Generate unique, diverse questions each time. Return ONLY a valid JSON array.'
        },
        {
          role: 'user',
          content: buildPrompt(title) + `\n\n[Seed: ${randomSeed}, Time: ${timestamp}] Generate 10 UNIQUE questions now.`
        }
      ],
      temperature: 0.9,  // High temperature for more randomness and variety
      max_tokens: 3000
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
  return normalizeQuiz(llmArray);
};

/**
 * Public entry-point: generate a quiz for the given topic title.
 */
const generateQuiz = async (title) => {
  const quiz = await callGroqQuiz(title);

  return {
    title,
    total_questions: quiz.length,
    quiz
  };
};

/**
 * Mark a quiz as passed with stage-based progression:
 * 1. Mark quiz_passed = true in user_roadmap for that skill_name + email
 * 2. Check if ALL skills in the current stage are completed
 * 3. If stage is complete:
 *    - Move the stage's main skill from missing_skills to skills
 *    - Unlock the next stage
 */
const passQuiz = async (email, title) => {
  // Step 1: Mark this specific quiz as passed
  await quizRepository.markQuizPassed(email, title);

  // Step 2: Get the user's complete roadmap to check stage completion
  const roadmap = await quizRepository.getUserRoadmap(email);
  
  if (!roadmap || roadmap.length === 0) {
    return { 
      message: 'Quiz passed successfully',
      stageCompleted: false
    };
  }

  // Step 3: Find which stage this skill belongs to
  const currentSkillEntry = roadmap.find(
    item => item.skill_name.toLowerCase().trim() === title.toLowerCase().trim()
  );

  if (!currentSkillEntry) {
    return { 
      message: 'Quiz passed successfully',
      stageCompleted: false
    };
  }

  const currentStageOrder = currentSkillEntry.stage_order;
  const currentStageName = currentSkillEntry.stage_name;

  // Step 4: Get all skills in this stage
  const stageSkills = roadmap.filter(item => item.stage_order === currentStageOrder);
  
  // Step 5: Check if ALL skills in this stage have quiz_passed = true
  const allQuizzesPassed = stageSkills.every(item => item.quiz_passed);

  if (allQuizzesPassed) {
    console.log(`\n${'🎊'.repeat(40)}`);
    console.log(`🎉 STAGE "${currentStageName}" COMPLETED!`);
    console.log(`${'🎊'.repeat(40)}\n`);

    // Step 6: Get user's current skills
    const user = await quizRepository.getUserSkills(email);
    if (!user) {
      return { 
        message: 'Quiz passed successfully',
        stageCompleted: true,
        stageName: currentStageName
      };
    }

    const currentSkills = Array.isArray(user.skills) ? user.skills : [];
    const missingSkills = Array.isArray(user.missing_skills) ? user.missing_skills : [];

    console.log(`📊 BEFORE SKILL UPDATE:`);
    console.log(`   Current Skills: [${currentSkills.join(', ')}]`);
    console.log(`   Missing Skills: [${missingSkills.join(', ')}]\n`);

    // Step 7: Move all stage skills from missing_skills to skills
    let skillsMoved = 0;
    const movedSkillsList = [];
    
    for (const stageSkill of stageSkills) {
      const skillName = stageSkill.skill_name;
      const normalizedSkill = skillName.toLowerCase().trim();
      
      const missingIndex = missingSkills.findIndex(
        skill => String(skill).toLowerCase().trim() === normalizedSkill
      );

      if (missingIndex !== -1) {
        const removedSkill = missingSkills.splice(missingIndex, 1)[0];
        
        // Add to current skills if not already present
        const alreadyHas = currentSkills.some(
          skill => String(skill).toLowerCase().trim() === normalizedSkill
        );
        
        if (!alreadyHas) {
          currentSkills.push(removedSkill);
          skillsMoved++;
          movedSkillsList.push(removedSkill);
          console.log(`   ✅ Moving skill: "${removedSkill}" → current_skills`);
        }
      }
    }

    // Step 8: Update user skills
    if (skillsMoved > 0) {
      await quizRepository.moveSkillToCurrent(email, currentSkills, missingSkills);
      
      console.log(`\n🎯 SKILL UPDATE COMPLETE!`);
      console.log(`   ${skillsMoved} skill(s) moved: [${movedSkillsList.join(', ')}]`);
      console.log(`\n📊 AFTER SKILL UPDATE:`);
      console.log(`   Current Skills: [${currentSkills.join(', ')}]`);
      console.log(`   Missing Skills: [${missingSkills.join(', ')}]\n`);
    }

    // Step 9: Unlock next stage
    const nextStageOrder = currentStageOrder + 1;
    const nextStageSkills = roadmap.filter(item => item.stage_order === nextStageOrder);
    
    if (nextStageSkills.length > 0) {
      await quizRepository.unlockStage(email, nextStageOrder);
      console.log(`🔓 UNLOCKED NEXT STAGE: ${nextStageSkills[0].stage_name}`);
      console.log(`   🚀 Ready to continue your learning journey!\n`);
      
      return {
        message: 'Quiz passed successfully',
        stageCompleted: true,
        stageName: currentStageName,
        skillsMoved: skillsMoved,
        nextStageUnlocked: true,
        nextStageName: nextStageSkills[0].stage_name
      };
    }

    console.log(`🏆 ALL STAGES COMPLETED!`);
    console.log(`   🎊 Congratulations on completing the entire roadmap!\n`);

    return {
      message: 'Quiz passed successfully',
      stageCompleted: true,
      stageName: currentStageName,
      skillsMoved: skillsMoved,
      nextStageUnlocked: false,
      allStagesCompleted: true
    };
  }

  // Stage not yet complete
  return { 
    message: 'Quiz passed successfully',
    stageCompleted: false,
    stageName: currentStageName,
    progress: `${stageSkills.filter(s => s.quiz_passed).length}/${stageSkills.length} quizzes completed in this stage`
  };
};

module.exports = {
  generateQuiz,
  passQuiz
};
