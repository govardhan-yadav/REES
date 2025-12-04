// ============================================
// PERSONALIZED LEARNING PATH ENGINE
// ============================================

// Curriculum structure with prerequisites and difficulty
const CURRICULUM = {
  6: {
    Math: [
      { id: 'm6_1', topic: 'Whole Numbers', difficulty: 1, prereq: [] },
      { id: 'm6_2', topic: 'Integers', difficulty: 2, prereq: ['m6_1'] },
      { id: 'm6_3', topic: 'Fractions', difficulty: 2, prereq: ['m6_1'] },
      { id: 'm6_4', topic: 'Decimals', difficulty: 3, prereq: ['m6_3'] },
      { id: 'm6_5', topic: 'Algebra Basics', difficulty: 3, prereq: ['m6_2'] }
    ],
    Science: [
      { id: 's6_1', topic: 'Food and Nutrition', difficulty: 1, prereq: [] },
      { id: 's6_2', topic: 'Materials', difficulty: 1, prereq: [] },
      { id: 's6_3', topic: 'Living Organisms', difficulty: 2, prereq: ['s6_1'] },
      { id: 's6_4', topic: 'Motion and Measurement', difficulty: 2, prereq: [] },
      { id: 's6_5', topic: 'Light and Shadows', difficulty: 3, prereq: ['s6_4'] }
    ],
    English: [
      { id: 'e6_1', topic: 'Grammar Fundamentals', difficulty: 1, prereq: [] },
      { id: 'e6_2', topic: 'Sentence Structure', difficulty: 2, prereq: ['e6_1'] },
      { id: 'e6_3', topic: 'Reading Comprehension', difficulty: 2, prereq: [] },
      { id: 'e6_4', topic: 'Writing Skills', difficulty: 3, prereq: ['e6_2'] },
      { id: 'e6_5', topic: 'Poetry Analysis', difficulty: 3, prereq: ['e6_3'] }
    ]
  },
  7: {
    Math: [
      { id: 'm7_1', topic: 'Rational Numbers', difficulty: 1, prereq: [] },
      { id: 'm7_2', topic: 'Linear Equations', difficulty: 2, prereq: ['m7_1'] },
      { id: 'm7_3', topic: 'Geometry Basics', difficulty: 2, prereq: [] },
      { id: 'm7_4', topic: 'Perimeter and Area', difficulty: 3, prereq: ['m7_3'] },
      { id: 'm7_5', topic: 'Data Handling', difficulty: 3, prereq: [] }
    ],
    Science: [
      { id: 's7_1', topic: 'Nutrition in Plants', difficulty: 1, prereq: [] },
      { id: 's7_2', topic: 'Heat and Temperature', difficulty: 2, prereq: [] },
      { id: 's7_3', topic: 'Acids and Bases', difficulty: 2, prereq: [] },
      { id: 's7_4', topic: 'Weather and Climate', difficulty: 3, prereq: ['s7_2'] },
      { id: 's7_5', topic: 'Electric Current', difficulty: 3, prereq: [] }
    ],
    English: [
      { id: 'e7_1', topic: 'Advanced Grammar', difficulty: 1, prereq: [] },
      { id: 'e7_2', topic: 'Essay Writing', difficulty: 2, prereq: ['e7_1'] },
      { id: 'e7_3', topic: 'Literature Analysis', difficulty: 2, prereq: [] },
      { id: 'e7_4', topic: 'Persuasive Writing', difficulty: 3, prereq: ['e7_2'] },
      { id: 'e7_5', topic: 'Critical Reading', difficulty: 3, prereq: ['e7_3'] }
    ]
  },
  8: {
    Math: [
      { id: 'm8_1', topic: 'Exponents and Powers', difficulty: 1, prereq: [] },
      { id: 'm8_2', topic: 'Algebraic Expressions', difficulty: 2, prereq: ['m8_1'] },
      { id: 'm8_3', topic: 'Quadrilaterals', difficulty: 2, prereq: [] },
      { id: 'm8_4', topic: 'Mensuration', difficulty: 3, prereq: ['m8_3'] },
      { id: 'm8_5', topic: 'Probability', difficulty: 3, prereq: [] }
    ],
    Science: [
      { id: 's8_1', topic: 'Crop Production', difficulty: 1, prereq: [] },
      { id: 's8_2', topic: 'Force and Pressure', difficulty: 2, prereq: [] },
      { id: 's8_3', topic: 'Chemical Reactions', difficulty: 2, prereq: [] },
      { id: 's8_4', topic: 'Sound', difficulty: 3, prereq: ['s8_2'] },
      { id: 's8_5', topic: 'Cell Structure', difficulty: 3, prereq: [] }
    ],
    English: [
      { id: 'e8_1', topic: 'Complex Grammar', difficulty: 1, prereq: [] },
      { id: 'e8_2', topic: 'Formal Writing', difficulty: 2, prereq: ['e8_1'] },
      { id: 'e8_3', topic: 'Drama and Theatre', difficulty: 2, prereq: [] },
      { id: 'e8_4', topic: 'Debate Skills', difficulty: 3, prereq: ['e8_2'] },
      { id: 'e8_5', topic: 'Advanced Literature', difficulty: 3, prereq: ['e8_3'] }
    ]
  }
};

// ============================================
// CORE ANALYSIS FUNCTIONS
// ============================================

/**
 * Calculate average score per subject
 * @param {Array} quizScores - Array of quiz attempt objects
 * @returns {Object} Subject-wise average scores
 */
function calculateSubjectAverages(quizScores) {
  const subjectData = {};
  
  quizScores.forEach(quiz => {
    const subject = quiz.subject;
    if (!subjectData[subject]) {
      subjectData[subject] = { total: 0, count: 0 };
    }
    subjectData[subject].total += quiz.score;
    subjectData[subject].count += 1;
  });
  
  const averages = {};
  for (const subject in subjectData) {
    averages[subject] = subjectData[subject].total / subjectData[subject].count;
  }
  
  return averages;
}

/**
 * Identify weak topics based on quiz performance
 * @param {Array} quizScores - Array of quiz attempt objects
 * @param {number} threshold - Score threshold for weak topics (default: 60)
 * @returns {Array} Array of weak topics with details
 */
function identifyWeakTopics(quizScores, threshold = 60) {
  return quizScores
    .filter(quiz => quiz.score < threshold)
    .map(quiz => ({
      subject: quiz.subject,
      chapter: quiz.chapter,
      score: quiz.score,
      attempts: quizScores.filter(q => q.subject === quiz.subject && q.chapter === quiz.chapter).length
    }))
    .sort((a, b) => a.score - b.score);
}

/**
 * Get completed topics from quiz history
 * @param {Array} quizScores - Array of quiz attempt objects
 * @param {number} passThreshold - Minimum score to consider topic completed
 * @returns {Set} Set of completed topic IDs
 */
function getCompletedTopics(quizScores, passThreshold = 70) {
  const completed = new Set();
  
  quizScores.forEach(quiz => {
    if (quiz.score >= passThreshold) {
      completed.add(`${quiz.subject}_${quiz.chapter}`);
    }
  });
  
  return completed;
}

/**
 * Check if prerequisites are met for a topic
 * @param {Object} topic - Topic object with prereq array
 * @param {Set} completedTopics - Set of completed topic IDs
 * @returns {boolean} True if all prerequisites are met
 */
function checkPrerequisites(topic, completedTopics) {
  return topic.prereq.every(prereq => completedTopics.has(prereq));
}

/**
 * Get topics from watched videos
 * @param {Array} watchedVideos - Array of video objects
 * @returns {Set} Set of topics covered in videos
 */
function getWatchedTopics(watchedVideos) {
  const watched = new Set();
  
  watchedVideos.forEach(video => {
    if (video.topic) {
      watched.add(video.topic);
    }
  });
  
  return watched;
}

// ============================================
// RECOMMENDATION ENGINE
// ============================================

/**
 * Generate next topic recommendations
 * @param {Object} topic - Topic object
 * @param {number} score - Current performance score
 * @param {boolean} isWeak - Whether this is a weak topic
 * @param {boolean} isWatched - Whether video was watched
 * @returns {Object} Recommendation object
 */
function createRecommendation(topic, score, isWeak, isWatched) {
  let reason = '';
  let priority = 0;
  
  if (isWeak) {
    reason = `Needs improvement (${score}%)`;
    priority = 3;
  } else if (!isWatched) {
    reason = 'Not yet explored';
    priority = 2;
  } else {
    reason = 'Next in curriculum';
    priority = 1;
  }
  
  return {
    topicId: topic.id,
    topic: topic.topic,
    difficulty: topic.difficulty,
    difficultyLabel: ['Easy', 'Medium', 'Hard'][topic.difficulty - 1],
    reason: reason,
    priority: priority,
    actions: [
      { type: 'video', label: 'Watch Tutorial' },
      { type: 'practice', label: 'Practice Exercises' },
      { type: 'quiz', label: 'Take Quiz' }
    ]
  };
}

/**
 * Generate personalized learning path
 * @param {Array} quizScores - Array of quiz attempt objects
 * @param {Array} watchedVideos - Array of watched video objects
 * @param {number} classLevel - Student's class level (6, 7, or 8)
 * @returns {Object} Complete learning path with recommendations
 */
function generateLearningPath(quizScores, watchedVideos, classLevel) {
  // Validate inputs
  if (!CURRICULUM[classLevel]) {
    return { error: 'Invalid class level. Must be 6, 7, or 8.' };
  }
  
  // Analyze current performance
  const subjectAverages = calculateSubjectAverages(quizScores);
  const weakTopics = identifyWeakTopics(quizScores);
  const completedTopics = getCompletedTopics(quizScores);
  const watchedTopics = getWatchedTopics(watchedVideos);
  
  // Generate recommendations per subject
  const recommendations = {};
  const curriculum = CURRICULUM[classLevel];
  
  for (const subject in curriculum) {
    const topics = curriculum[subject];
    const subjectRecommendations = [];
    
    // Priority 1: Address weak topics first
    weakTopics
      .filter(weak => weak.subject === subject)
      .slice(0, 1)
      .forEach(weak => {
        const topic = topics.find(t => t.topic === weak.chapter);
        if (topic) {
          subjectRecommendations.push(
            createRecommendation(topic, weak.score, true, watchedTopics.has(topic.topic))
          );
        }
      });
    
    // Priority 2: Next topics in curriculum order
    for (const topic of topics) {
      if (subjectRecommendations.length >= 3) break;
      
      const topicKey = `${subject}_${topic.topic}`;
      const isCompleted = completedTopics.has(topicKey);
      const prereqsMet = checkPrerequisites(topic, completedTopics);
      
      if (!isCompleted && prereqsMet) {
        const quizAttempt = quizScores.find(q => q.subject === subject && q.chapter === topic.topic);
        const score = quizAttempt ? quizAttempt.score : 0;
        const isWatched = watchedTopics.has(topic.topic);
        
        subjectRecommendations.push(
          createRecommendation(topic, score, false, isWatched)
        );
      }
    }
    
    // Sort by priority and limit to 3 steps
    recommendations[subject] = subjectRecommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  }
  
  // Calculate overall progress
  const totalTopics = Object.values(curriculum).reduce((sum, topics) => sum + topics.length, 0);
  const completedCount = completedTopics.size;
  const progressPercentage = Math.round((completedCount / totalTopics) * 100);
  
  // Identify focus area (weakest subject)
  const focusSubject = Object.entries(subjectAverages)
    .sort((a, b) => a[1] - b[1])[0];
  
  return {
    classLevel: classLevel,
    generatedAt: new Date().toISOString(),
    progress: {
      completed: completedCount,
      total: totalTopics,
      percentage: progressPercentage
    },
    performance: {
      subjectAverages: subjectAverages,
      weakTopicsCount: weakTopics.length,
      focusArea: focusSubject ? focusSubject[0] : 'None'
    },
    learningPath: recommendations,
    summary: {
      nextSteps: Object.values(recommendations).flat().slice(0, 3),
      estimatedTime: '2-3 weeks',
      recommendation: focusSubject 
        ? `Focus on ${focusSubject[0]} (${Math.round(focusSubject[1])}% average)`
        : 'Keep up the great work!'
    }
  };
}

// ============================================
// EXPORT FOR NODE.JS / BROWSER
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateLearningPath,
    calculateSubjectAverages,
    identifyWeakTopics,
    getCompletedTopics,
    CURRICULUM
  };
}
