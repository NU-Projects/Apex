const quizService = require('../services/quizService');

const generateQuiz = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a valid topic for the quiz.' 
      });
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(` GENERATING QUIZ FOR: ${title}`);
    console.log(`${'='.repeat(80)}\n`);
    
    const result = await quizService.generateQuiz(title.trim());
    
    console.log(` Successfully generated ${result.quiz.length} questions\n`);
    
    // Log all questions with correct answers
    result.quiz.forEach((q, index) => {
      console.log(`\n Question ${index + 1}:`);
      console.log(`   ${q.statement}`);
      console.log(`   Options:`);
      q.options.forEach((opt, i) => {
        const isCorrect = opt === q.correct_option;
        const marker = isCorrect ? '✓' : ' ';
        console.log(`   ${['A', 'B', 'C', 'D'][i]}. [${marker}] ${opt}`);
      });
      console.log(`   Correct Answer: ${q.correct_option}`);
    });
    
    console.log(`\n${'-'.repeat(80)}\n`);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('[Quiz] Generation failed:', error.message);
    const statusCode = error.statusCode || 500;
    const userMessage = statusCode === 500 
      ? 'Unable to generate quiz. Please try again later.' 
      : error.message;
    return res.status(statusCode).json({ 
      success: false,
      error: userMessage 
    });
  }
};

const passQuiz = async (req, res) => {
  try {
    const { email, title } = req.body;

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required to save your progress.' 
      });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Quiz topic is required.' 
      });
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`🎓 QUIZ PASSED: ${title}`);
    console.log(`👤 User: ${email}`);
    console.log(`${'='.repeat(80)}\n`);
    
    const result = await quizService.passQuiz(email.trim(), title.trim());
    
    // Log detailed progression info
    if (result.stageCompleted) {
      console.log(`\n🎉 STAGE COMPLETED: ${result.stageName}`);
      console.log(`${'─'.repeat(80)}`);
      
      if (result.skillsMoved > 0) {
        console.log(`\n📊 SKILL PROGRESSION:`);
        console.log(`   ✅ ${result.skillsMoved} skill(s) moved from missing_skills → skills`);
        console.log(`   🎯 Skills are now part of your current skillset!`);
      }
      
      if (result.nextStageUnlocked) {
        console.log(`\n🔓 NEXT STAGE UNLOCKED: ${result.nextStageName}`);
        console.log(`   🚀 You can now start learning the next stage!`);
      } else if (result.allStagesCompleted) {
        console.log(`\n🏆 CONGRATULATIONS! All stages completed!`);
        console.log(`   🎊 You've mastered the entire learning path!`);
      }
      
      console.log(`\n${'='.repeat(80)}\n`);
    } else {
      console.log(`\n📈 PROGRESS UPDATE:`);
      console.log(`   Stage: ${result.stageName}`);
      console.log(`   Progress: ${result.progress || 'In progress'}`);
      console.log(`   💡 Complete all quizzes in this stage to unlock the next one!\n`);
      console.log(`${'='.repeat(80)}\n`);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const userMessage = statusCode === 500 
      ? 'Unable to save quiz progress. Please try again later.' 
      : error.message;
    return res.status(statusCode).json({ 
      success: false,
      error: userMessage 
    });
  }
};

module.exports = {
  generateQuiz,
  passQuiz
};
