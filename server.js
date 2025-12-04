require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { QBusinessClient, ChatSyncCommand } = require('@aws-sdk/client-qbusiness');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const DATA_DIR = path.join(__dirname, 'data');
if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const TEACHERS_FILE = path.join(DATA_DIR, 'teachers.json');
const QUIZZES_FILE = path.join(DATA_DIR, 'quizzes.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const BADGES_DEF_FILE = path.join(DATA_DIR, 'badge-definitions.json');

// ========================================
// DATA HELPERS
// ========================================
function loadData(file){
  try{
    if(!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file,'utf8'));
  }catch(e){return []}
}

function saveData(file,data){
  fs.writeFileSync(file,JSON.stringify(data,null,2));
}

// ========================================
// AUTH MIDDLEWARE
// ========================================
function authTeacher(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({error:'No token provided'});
  
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.teacher = decoded;
    next();
  }catch(e){
    res.status(401).json({error:'Invalid token'});
  }
}

// ========================================
// GEMINI CHATBOT API (existing)
// ========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an educational assistant for an Indian school website. Help with NCERT books, courses, and learning. Be concise and helpful.\n\nUser: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      res.json({ reply });
    } else {
      throw new Error('No response');
    }
  } catch (error) {
    res.json({ reply: 'I can help you with NCERT books, courses, and educational content.' });
  }
});

// ========================================
// TEACHER AUTH ROUTES
// ========================================

// Teacher Login
app.post('/api/auth/teacher/login', async (req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.json({success:false,error:'Email and password required'});
  
  const teachers = loadData(TEACHERS_FILE);
  const teacher = teachers.find(t=>t.email===email);
  
  if(!teacher) return res.json({success:false,error:'Invalid email or password'});
  
  // Compare password
  const validPassword = await bcrypt.compare(password, teacher.password);
  if(!validPassword) return res.json({success:false,error:'Invalid email or password'});
  
  // Generate JWT
  const token = jwt.sign(
    {id:teacher.id, email:teacher.email, name:teacher.name},
    process.env.JWT_SECRET,
    {expiresIn:'7d'}
  );
  
  res.json({
    success:true,
    token,
    teacher:{id:teacher.id, name:teacher.name, email:teacher.email}
  });
});

// Teacher Registration (optional - for adding new teachers)
app.post('/api/auth/teacher/register', async (req,res)=>{
  const {name,email,password} = req.body;
  if(!name||!email||!password) return res.json({success:false,error:'All fields required'});
  
  const teachers = loadData(TEACHERS_FILE);
  if(teachers.find(t=>t.email===email)) return res.json({success:false,error:'Email already registered'});
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const teacher = {
    id:Date.now().toString(),
    name,
    email,
    password:hashedPassword,
    createdAt:new Date().toISOString()
  };
  
  teachers.push(teacher);
  saveData(TEACHERS_FILE,teachers);
  
  // Generate JWT
  const token = jwt.sign(
    {id:teacher.id, email:teacher.email, name:teacher.name},
    process.env.JWT_SECRET,
    {expiresIn:'7d'}
  );
  
  res.json({
    success:true,
    token,
    teacher:{id:teacher.id, name:teacher.name, email:teacher.email}
  });
});

// ========================================
// QUIZ ROUTES
// ========================================

// Create Quiz (Protected)
app.post('/api/quizzes', authTeacher, (req,res)=>{
  const {className,subject,chapter,difficulty,questions} = req.body;
  
  if(!className||!subject||!chapter||!difficulty||!questions||questions.length===0){
    return res.status(400).json({error:'Missing required fields'});
  }
  
  const quiz = {
    id:'q_'+Date.now(),
    className,
    subject,
    chapter,
    difficulty,
    questions,
    createdBy:req.teacher.email,
    createdAt:new Date().toISOString()
  };
  
  const quizzes = loadData(QUIZZES_FILE);
  quizzes.push(quiz);
  saveData(QUIZZES_FILE,quizzes);
  
  res.json({success:true,quiz});
});

// Get Quizzes (Public - for students)
app.get('/api/quizzes', (req,res)=>{
  const {className,subject,chapter} = req.query;
  let quizzes = loadData(QUIZZES_FILE);
  
  // Filter by query params
  if(className) quizzes = quizzes.filter(q=>q.className===className);
  if(subject) quizzes = quizzes.filter(q=>q.subject.toLowerCase()===subject.toLowerCase());
  if(chapter) quizzes = quizzes.filter(q=>q.chapter.toLowerCase()===chapter.toLowerCase());
  
  res.json({success:true,quizzes});
});

// Get Teacher's Quizzes (Protected)
app.get('/api/quizzes/my', authTeacher, (req,res)=>{
  const quizzes = loadData(QUIZZES_FILE);
  const myQuizzes = quizzes.filter(q=>q.createdBy===req.teacher.email);
  res.json({success:true,quizzes:myQuizzes});
});

// Delete Quiz (Protected)
app.delete('/api/quizzes/:id', authTeacher, (req,res)=>{
  let quizzes = loadData(QUIZZES_FILE);
  const quiz = quizzes.find(q=>q.id===req.params.id);
  
  if(!quiz) return res.status(404).json({error:'Quiz not found'});
  if(quiz.createdBy!==req.teacher.email) return res.status(403).json({error:'Not authorized'});
  
  quizzes = quizzes.filter(q=>q.id!==req.params.id);
  saveData(QUIZZES_FILE,quizzes);
  
  res.json({success:true});
});

// ========================================
// AI QUESTION GENERATION (Amazon Q Business)
// ========================================
app.post('/api/quizzes/ai-suggest', authTeacher, async (req,res)=>{
  const {className,subject,topic,notes,difficulty} = req.body;
  
  if(!className||!subject||!topic){
    return res.status(400).json({error:'className, subject, and topic are required'});
  }
  
  try{
    // Initialize Amazon Q Business client
    const qClient = new QBusinessClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    
    // Build prompt for MCQ generation
    const prompt = `You are an expert teacher creating multiple-choice questions for Indian school students.

Generate exactly 5 MCQ questions for:
- Class: ${className}
- Subject: ${subject}
- Topic: ${topic}
${difficulty ? `- Difficulty: ${difficulty}` : ''}
${notes ? `- Additional context: ${notes}` : ''}

IMPORTANT: Respond ONLY with valid JSON array. No explanations, no markdown, just the JSON.

Format:
[
  {
    "q": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Brief explanation why this is correct"
  }
]

Requirements:
- Exactly 4 options per question
- answerIndex is 0-3 (index of correct option)
- Questions should be age-appropriate for ${className}
- Follow NCERT curriculum standards
- Include brief explanations`;

    // Call Amazon Q Business ChatSync API
    const command = new ChatSyncCommand({
      applicationId: process.env.Q_APP_ID,
      userId: req.teacher.email,
      userMessage: prompt,
      clientToken: Date.now().toString()
    });
    
    const response = await qClient.send(command);
    
    // Extract text from response
    let aiText = response.systemMessage || '';
    
    // Parse JSON from response
    // Remove markdown code blocks if present
    aiText = aiText.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    
    const questions = JSON.parse(aiText);
    
    if(!Array.isArray(questions) || questions.length===0){
      throw new Error('Invalid response format');
    }
    
    res.json({success:true,questions});
    
  }catch(error){
    console.error('AI generation error:',error);
    
    // Fallback: Generate sample questions if AI fails
    const fallbackQuestions = [
      {
        q:`Sample question for ${className} ${subject} - ${topic}?`,
        options:['Option A','Option B','Option C','Option D'],
        answerIndex:0,
        explanation:'This is a sample question. Configure AWS Q Business to get AI-generated questions.'
      }
    ];
    
    res.json({
      success:true,
      questions:fallbackQuestions,
      warning:'AI generation unavailable. Using sample questions. Please configure AWS Q Business credentials.'
    });
  }
});

// ========================================
// PROGRESS TRACKING ROUTES
// ========================================

// Save quiz progress
app.post('/api/progress', (req,res)=>{
  const {userId,className,subject,chapter,score,correct,total,quizId} = req.body;
  
  if(!userId||!className||!subject||!chapter||score===undefined||!correct||!total){
    return res.status(400).json({error:'Missing required fields'});
  }
  
  const progress = loadData(PROGRESS_FILE);
  const entry = {
    id:Date.now().toString(),
    userId,
    className,
    subject,
    chapter,
    score,
    correct,
    total,
    quizId:quizId||null,
    date:new Date().toISOString()
  };
  
  progress.push(entry);
  saveData(PROGRESS_FILE,progress);
  
  res.json({success:true,entry});
});

// Get progress summary
app.get('/api/progress/summary', (req,res)=>{
  const {userId} = req.query;
  if(!userId) return res.status(400).json({error:'userId required'});
  
  const progress = loadData(PROGRESS_FILE);
  const userProgress = progress.filter(p=>p.userId===userId);
  
  if(userProgress.length===0){
    return res.json({
      userId,
      totalQuizzes:0,
      averageScore:0,
      weakestSubject:null,
      lastAttempt:null,
      bySubject:[]
    });
  }
  
  // Calculate stats
  const totalQuizzes = userProgress.length;
  const averageScore = userProgress.reduce((sum,p)=>sum+p.score,0)/totalQuizzes;
  
  // By subject
  const bySubject = {};
  userProgress.forEach(p=>{
    if(!bySubject[p.subject]){
      bySubject[p.subject]={subject:p.subject,scores:[],quizzes:0};
    }
    bySubject[p.subject].scores.push(p.score);
    bySubject[p.subject].quizzes++;
  });
  
  const subjectStats = Object.values(bySubject).map(s=>({
    subject:s.subject,
    avgScore:s.scores.reduce((a,b)=>a+b,0)/s.scores.length,
    quizzes:s.quizzes
  }));
  
  // Weakest subject
  const weakest = subjectStats.reduce((min,s)=>s.avgScore<min.avgScore?s:min,subjectStats[0]);
  
  // Last attempt
  const lastAttempt = userProgress.sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  
  res.json({
    userId,
    totalQuizzes,
    averageScore,
    weakestSubject:weakest,
    lastAttempt:{
      class:lastAttempt.className,
      subject:lastAttempt.subject,
      chapter:lastAttempt.chapter,
      score:lastAttempt.score,
      date:lastAttempt.date
    },
    bySubject:subjectStats
  });
});

// ========================================
// BADGES & ACHIEVEMENTS SYSTEM
// ========================================

// Badge definitions (can be loaded from JSON file)
const BADGE_DEFINITIONS = [
  {
    code:'first_quiz',
    label:'First Steps',
    description:'Completed your first quiz',
    icon:'🎯',
    category:'milestone'
  },
  {
    code:'quiz_explorer',
    label:'Quiz Explorer',
    description:'Completed 5 quizzes',
    icon:'🗺️',
    category:'milestone'
  },
  {
    code:'high_scorer',
    label:'High Scorer',
    description:'Scored 80%+ in 3 quizzes',
    icon:'⭐',
    category:'achievement'
  },
  {
    code:'consistency',
    label:'Consistency Champion',
    description:'Completed quizzes for 3 consecutive days',
    icon:'🔥',
    category:'streak'
  },
  {
    code:'perfect_score',
    label:'Perfect Score',
    description:'Achieved 100% in any quiz',
    icon:'💯',
    category:'achievement'
  },
  {
    code:'quiz_master',
    label:'Quiz Master',
    description:'Completed 20 quizzes',
    icon:'👑',
    category:'milestone'
  },
  {
    code:'dedicated_learner',
    label:'Dedicated Learner',
    description:'Completed 50 quizzes',
    icon:'📚',
    category:'milestone'
  }
];

// Subject-specific badges (generated dynamically)
const SUBJECTS = ['Mathematics','Science','English','Hindi','Social Studies'];
SUBJECTS.forEach(subject=>{
  BADGE_DEFINITIONS.push({
    code:`subject_master_${subject.toLowerCase().replace(/\s+/g,'_')}`,
    label:`${subject} Master`,
    description:`Average 85%+ in ${subject} (5+ quizzes)`,
    icon:'🏆',
    category:'subject',
    meta:{subject}
  });
});

// Helper: Check if user earned "First Steps" badge
function checkFirstQuiz(userProgress){
  return userProgress.length >= 1 ? userProgress[0].date : null;
}

// Helper: Check if user earned "Quiz Explorer" badge
function checkQuizExplorer(userProgress){
  return userProgress.length >= 5 ? userProgress[4].date : null;
}

// Helper: Check if user earned "Quiz Master" badge
function checkQuizMaster(userProgress){
  return userProgress.length >= 20 ? userProgress[19].date : null;
}

// Helper: Check if user earned "Dedicated Learner" badge
function checkDedicatedLearner(userProgress){
  return userProgress.length >= 50 ? userProgress[49].date : null;
}

// Helper: Check if user earned "High Scorer" badge
function checkHighScorer(userProgress){
  const highScores = userProgress.filter(p=>p.score>=80);
  return highScores.length >= 3 ? highScores[2].date : null;
}

// Helper: Check if user earned "Perfect Score" badge
function checkPerfectScore(userProgress){
  const perfect = userProgress.find(p=>p.score===100);
  return perfect ? perfect.date : null;
}

// Helper: Check if user earned "Consistency" badge (3 consecutive days)
function checkConsistency(userProgress){
  if(userProgress.length < 3) return null;
  
  // Sort by date
  const sorted = [...userProgress].sort((a,b)=>new Date(a.date)-new Date(b.date));
  
  // Get unique days
  const days = [...new Set(sorted.map(p=>p.date.split('T')[0]))];
  
  // Check for 3 consecutive days
  for(let i=0; i<=days.length-3; i++){
    const d1 = new Date(days[i]);
    const d2 = new Date(days[i+1]);
    const d3 = new Date(days[i+2]);
    
    const diff1 = (d2-d1)/(1000*60*60*24);
    const diff2 = (d3-d2)/(1000*60*60*24);
    
    if(diff1===1 && diff2===1){
      return days[i+2]+'T00:00:00.000Z';
    }
  }
  
  return null;
}

// Helper: Check if user earned "Subject Master" badge
function checkSubjectMaster(userProgress,subject){
  const subjectQuizzes = userProgress.filter(p=>p.subject===subject);
  if(subjectQuizzes.length < 5) return null;
  
  const avgScore = subjectQuizzes.reduce((sum,p)=>sum+p.score,0)/subjectQuizzes.length;
  return avgScore >= 85 ? subjectQuizzes[subjectQuizzes.length-1].date : null;
}

// Main function: Compute all badges for a user
function computeBadgesForUser(userId){
  const progress = loadData(PROGRESS_FILE);
  const userProgress = progress.filter(p=>p.userId===userId);
  
  const badges = [];
  
  // Check each badge
  BADGE_DEFINITIONS.forEach(def=>{
    let earnedAt = null;
    
    switch(def.code){
      case 'first_quiz':
        earnedAt = checkFirstQuiz(userProgress);
        break;
      case 'quiz_explorer':
        earnedAt = checkQuizExplorer(userProgress);
        break;
      case 'quiz_master':
        earnedAt = checkQuizMaster(userProgress);
        break;
      case 'dedicated_learner':
        earnedAt = checkDedicatedLearner(userProgress);
        break;
      case 'high_scorer':
        earnedAt = checkHighScorer(userProgress);
        break;
      case 'perfect_score':
        earnedAt = checkPerfectScore(userProgress);
        break;
      case 'consistency':
        earnedAt = checkConsistency(userProgress);
        break;
      default:
        // Subject master badges
        if(def.code.startsWith('subject_master_')){
          earnedAt = checkSubjectMaster(userProgress,def.meta.subject);
        }
    }
    
    badges.push({
      code:def.code,
      label:def.label,
      description:def.description,
      icon:def.icon,
      category:def.category,
      earned:!!earnedAt,
      earnedAt:earnedAt,
      meta:def.meta||null
    });
  });
  
  return badges;
}

// API: Get badges for a user
app.get('/api/badges', (req,res)=>{
  const {userId} = req.query;
  if(!userId) return res.status(400).json({error:'userId required'});
  
  const badges = computeBadgesForUser(userId);
  const earnedBadges = badges.filter(b=>b.earned);
  
  res.json({
    userId,
    totalBadges:BADGE_DEFINITIONS.length,
    earnedCount:earnedBadges.length,
    badges:badges
  });
});

// API: Get badge definitions (for reference)
app.get('/api/badges/definitions', (req,res)=>{
  res.json({badges:BADGE_DEFINITIONS});
});

// ========================================
// LEARNING PATH ENGINE
// ========================================
const {generateLearningPath} = require('./learning-path-engine.js');

// API: Get personalized learning path
app.get('/api/learning-path', (req,res)=>{
  const {userId,classLevel} = req.query;
  if(!userId) return res.status(400).json({error:'userId required'});
  if(!classLevel) return res.status(400).json({error:'classLevel required'});
  
  const progress = loadData(PROGRESS_FILE);
  const userProgress = progress.filter(p=>p.userId===userId);
  
  // Format progress for learning path engine
  const quizScores = userProgress.map(p=>({
    subject:p.subject,
    chapter:p.chapter,
    score:p.score,
    correct:p.correct,
    total:p.total,
    date:p.date
  }));
  
  // Empty watched videos for now (can be extended later)
  const watchedVideos = [];
  
  const learningPath = generateLearningPath(quizScores, watchedVideos, parseInt(classLevel));
  res.json(learningPath);
});

// ========================================
// STUDENT AUTH ROUTES
// ========================================

// Student Registration
app.post('/api/auth/student/register', async (req,res)=>{
  const {username,email,password} = req.body;
  if(!username||!email||!password) return res.json({success:false,error:'All fields required'});
  
  const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
  const students = loadData(STUDENTS_FILE);
  
  if(students.find(s=>s.email===email)) return res.json({success:false,error:'Email already registered'});
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const student = {
    id:Date.now().toString(),
    username,
    email,
    password:hashedPassword,
    createdAt:new Date().toISOString()
  };
  
  students.push(student);
  saveData(STUDENTS_FILE,students);
  
  res.json({
    success:true,
    student:{id:student.id, username:student.username, email:student.email}
  });
});

// Student Login
app.post('/api/auth/student/login', async (req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.json({success:false,error:'Email and password required'});
  
  const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
  const students = loadData(STUDENTS_FILE);
  const student = students.find(s=>s.email===email);
  
  if(!student) return res.json({success:false,error:'Invalid email or password'});
  
  const validPassword = await bcrypt.compare(password, student.password);
  if(!validPassword) return res.json({success:false,error:'Invalid email or password'});
  
  res.json({
    success:true,
    student:{id:student.id, username:student.username, email:student.email}
  });
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 Teacher Login: http://localhost:${PORT}/teacher-login.html`);
  console.log(`🎓 Teacher Dashboard: http://localhost:${PORT}/teacher-dashboard.html`);
});
