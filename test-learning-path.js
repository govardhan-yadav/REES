// ============================================
// TEST FILE FOR LEARNING PATH ENGINE
// ============================================

const { generateLearningPath } = require('./learning-path-engine.js');

// Sample quiz scores data
const sampleQuizScores = [
  { subject: 'Math', chapter: 'Whole Numbers', score: 85, correct: 17, total: 20, date: '2024-01-15' },
  { subject: 'Math', chapter: 'Integers', score: 45, correct: 9, total: 20, date: '2024-01-20' },
  { subject: 'Math', chapter: 'Fractions', score: 70, correct: 14, total: 20, date: '2024-01-25' },
  { subject: 'Science', chapter: 'Food and Nutrition', score: 90, correct: 18, total: 20, date: '2024-01-16' },
  { subject: 'Science', chapter: 'Materials', score: 55, correct: 11, total: 20, date: '2024-01-22' },
  { subject: 'English', chapter: 'Grammar Fundamentals', score: 75, correct: 15, total: 20, date: '2024-01-18' },
  { subject: 'English', chapter: 'Sentence Structure', score: 50, correct: 10, total: 20, date: '2024-01-28' }
];

// Sample watched videos data
const sampleWatchedVideos = [
  { videoId: 'v1', topic: 'Whole Numbers', duration: 600, watched: true },
  { videoId: 'v2', topic: 'Food and Nutrition', duration: 450, watched: true },
  { videoId: 'v3', topic: 'Grammar Fundamentals', duration: 500, watched: true },
  { videoId: 'v4', topic: 'Fractions', duration: 550, watched: true }
];

// Test for Class 6
console.log('='.repeat(60));
console.log('PERSONALIZED LEARNING PATH - CLASS 6');
console.log('='.repeat(60));

const learningPath = generateLearningPath(sampleQuizScores, sampleWatchedVideos, 6);

console.log('\n📊 OVERALL PROGRESS:');
console.log(`   Completed: ${learningPath.progress.completed}/${learningPath.progress.total} topics (${learningPath.progress.percentage}%)`);

console.log('\n📈 PERFORMANCE SUMMARY:');
console.log(`   Focus Area: ${learningPath.performance.focusArea}`);
console.log(`   Weak Topics: ${learningPath.performance.weakTopicsCount}`);
console.log('\n   Subject Averages:');
for (const [subject, avg] of Object.entries(learningPath.performance.subjectAverages)) {
  console.log(`   - ${subject}: ${Math.round(avg)}%`);
}

console.log('\n🎯 RECOMMENDED LEARNING PATH:');
for (const [subject, recommendations] of Object.entries(learningPath.learningPath)) {
  console.log(`\n   ${subject.toUpperCase()}:`);
  recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec.topic} [${rec.difficultyLabel}]`);
    console.log(`      Reason: ${rec.reason}`);
    console.log(`      Actions: ${rec.actions.map(a => a.label).join(' → ')}`);
  });
}

console.log('\n💡 SUMMARY:');
console.log(`   ${learningPath.summary.recommendation}`);
console.log(`   Estimated Time: ${learningPath.summary.estimatedTime}`);

console.log('\n' + '='.repeat(60));
console.log('FULL JSON OUTPUT:');
console.log('='.repeat(60));
console.log(JSON.stringify(learningPath, null, 2));
