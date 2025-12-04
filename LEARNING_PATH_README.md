# 🎓 Personalized Learning Path Engine

Complete JavaScript engine for generating personalized learning recommendations based on quiz performance and video engagement.

---

## 📁 Files Created

1. **learning-path-engine.js** - Core engine with modular functions
2. **test-learning-path.js** - Node.js test file with sample data
3. **learning-path-api.html** - Interactive browser demo
4. **LEARNING_PATH_README.md** - This documentation

---

## 🚀 Quick Start

### Option 1: Node.js Test
```bash
node test-learning-path.js
```

### Option 2: Browser Demo
Open `learning-path-api.html` in your browser

### Option 3: Integrate with Server
```javascript
const { generateLearningPath } = require('./learning-path-engine.js');

app.get('/api/learning-path', (req, res) => {
  const { userId } = req.query;
  const quizScores = getQuizScores(userId);
  const watchedVideos = getWatchedVideos(userId);
  const classLevel = getUserClass(userId);
  
  const path = generateLearningPath(quizScores, watchedVideos, classLevel);
  res.json(path);
});
```

---

## 📥 Input Format

### Quiz Scores (Array)
```json
[
  {
    "subject": "Math",
    "chapter": "Integers",
    "score": 45,
    "correct": 9,
    "total": 20,
    "date": "2024-01-20"
  }
]
```

### Watched Videos (Array)
```json
[
  {
    "videoId": "v1",
    "topic": "Whole Numbers",
    "duration": 600,
    "watched": true
  }
]
```

### Class Level (Number)
```javascript
6, 7, or 8
```

---

## 📤 Output Format

```json
{
  "classLevel": 6,
  "generatedAt": "2024-01-30T10:30:00.000Z",
  "progress": {
    "completed": 3,
    "total": 15,
    "percentage": 20
  },
  "performance": {
    "subjectAverages": {
      "Math": 66.67,
      "Science": 72.5,
      "English": 62.5
    },
    "weakTopicsCount": 3,
    "focusArea": "English"
  },
  "learningPath": {
    "Math": [
      {
        "topicId": "m6_2",
        "topic": "Integers",
        "difficulty": 2,
        "difficultyLabel": "Medium",
        "reason": "Needs improvement (45%)",
        "priority": 3,
        "actions": [
          { "type": "video", "label": "Watch Tutorial" },
          { "type": "practice", "label": "Practice Exercises" },
          { "type": "quiz", "label": "Take Quiz" }
        ]
      }
    ]
  },
  "summary": {
    "nextSteps": [...],
    "estimatedTime": "2-3 weeks",
    "recommendation": "Focus on English (63% average)"
  }
}
```

---

## 🧩 Core Functions

### 1. generateLearningPath(quizScores, watchedVideos, classLevel)
Main function that generates complete learning path.

**Returns:** Complete roadmap object

---

### 2. calculateSubjectAverages(quizScores)
Calculates average score per subject.

**Returns:** `{ Math: 75, Science: 80, English: 70 }`

---

### 3. identifyWeakTopics(quizScores, threshold)
Finds topics scoring below threshold (default: 60%).

**Returns:** Array of weak topics sorted by score

---

### 4. getCompletedTopics(quizScores, passThreshold)
Gets topics with score >= passThreshold (default: 70%).

**Returns:** Set of completed topic IDs

---

### 5. checkPrerequisites(topic, completedTopics)
Validates if all prerequisites are met.

**Returns:** Boolean

---

## 🎯 Algorithm Logic

### Priority System
1. **Priority 3 (Highest)**: Weak topics (score < 60%)
2. **Priority 2**: Unwatched topics in curriculum order
3. **Priority 1**: Next topics with prerequisites met

### Recommendation Rules
- ✅ Prioritize weak topics first
- ✅ Ensure curriculum order (prerequisites)
- ✅ Include difficulty level (Easy/Medium/Hard)
- ✅ Provide 3-step path per subject
- ✅ Consider watched videos
- ✅ Focus on weakest subject

---

## 📚 Curriculum Structure

### Class 6
- **Math**: Whole Numbers → Integers → Fractions → Decimals → Algebra Basics
- **Science**: Food & Nutrition → Materials → Living Organisms → Motion → Light
- **English**: Grammar → Sentence Structure → Reading → Writing → Poetry

### Class 7
- **Math**: Rational Numbers → Linear Equations → Geometry → Perimeter & Area → Data Handling
- **Science**: Nutrition in Plants → Heat → Acids & Bases → Weather → Electric Current
- **English**: Advanced Grammar → Essay Writing → Literature → Persuasive Writing → Critical Reading

### Class 8
- **Math**: Exponents → Algebraic Expressions → Quadrilaterals → Mensuration → Probability
- **Science**: Crop Production → Force & Pressure → Chemical Reactions → Sound → Cell Structure
- **English**: Complex Grammar → Formal Writing → Drama → Debate Skills → Advanced Literature

---

## 🔧 Integration Examples

### With Express Server
```javascript
const { generateLearningPath } = require('./learning-path-engine.js');

app.get('/api/learning-path/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  // Fetch from your database
  const quizScores = await db.getQuizScores(userId);
  const watchedVideos = await db.getWatchedVideos(userId);
  const student = await db.getStudent(userId);
  
  const path = generateLearningPath(
    quizScores, 
    watchedVideos, 
    student.classLevel
  );
  
  res.json(path);
});
```

### With Frontend
```javascript
async function loadLearningPath() {
  const userId = localStorage.getItem('quiz_user_id');
  const response = await fetch(`/api/learning-path/${userId}`);
  const path = await response.json();
  
  displayLearningPath(path);
}
```

---

## 🎨 Customization

### Adjust Thresholds
```javascript
const weakTopics = identifyWeakTopics(quizScores, 50); // 50% threshold
const completed = getCompletedTopics(quizScores, 80); // 80% pass mark
```

### Add More Subjects
```javascript
CURRICULUM[6].Hindi = [
  { id: 'h6_1', topic: 'Vyakaran', difficulty: 1, prereq: [] },
  { id: 'h6_2', topic: 'Rachna', difficulty: 2, prereq: ['h6_1'] }
];
```

### Modify Recommendation Count
```javascript
// Change from 3 to 5 recommendations per subject
recommendations[subject] = subjectRecommendations
  .sort((a, b) => b.priority - a.priority)
  .slice(0, 5); // Changed from 3 to 5
```

---

## 📊 Sample Output (Console)

```
============================================================
PERSONALIZED LEARNING PATH - CLASS 6
============================================================

📊 OVERALL PROGRESS:
   Completed: 3/15 topics (20%)

📈 PERFORMANCE SUMMARY:
   Focus Area: English
   Weak Topics: 3

   Subject Averages:
   - Math: 67%
   - Science: 73%
   - English: 63%

🎯 RECOMMENDED LEARNING PATH:

   MATH:
   1. Integers [Medium]
      Reason: Needs improvement (45%)
      Actions: Watch Tutorial → Practice Exercises → Take Quiz
   2. Decimals [Hard]
      Reason: Next in curriculum
      Actions: Watch Tutorial → Practice Exercises → Take Quiz

   SCIENCE:
   1. Materials [Easy]
      Reason: Needs improvement (55%)
      Actions: Watch Tutorial → Practice Exercises → Take Quiz

   ENGLISH:
   1. Sentence Structure [Medium]
      Reason: Needs improvement (50%)
      Actions: Watch Tutorial → Practice Exercises → Take Quiz

💡 SUMMARY:
   Focus on English (63% average)
   Estimated Time: 2-3 weeks
```

---

## 🧪 Testing

Run the test file to see complete output:
```bash
node test-learning-path.js
```

Expected output includes:
- Progress statistics
- Performance summary
- Subject-wise recommendations
- Full JSON structure

---

## 📝 Notes

- Engine works with JSON files (no database required)
- Fully modular and reusable
- Browser and Node.js compatible
- Prerequisite validation included
- Difficulty progression enforced
- Real-time progress tracking

---

## 🎯 Use Cases

1. **Student Dashboard**: Show personalized next steps
2. **Teacher Portal**: View student learning paths
3. **Mobile App**: Generate offline recommendations
4. **Email Reports**: Send weekly learning suggestions
5. **Chatbot Integration**: AI tutor recommendations

---

## 🚀 Next Steps

1. Integrate with your existing server.js
2. Add API endpoint for learning path
3. Display on student dashboard
4. Add video/quiz links to actions
5. Track recommendation completion

---

**Created by Amazon Q Developer**
