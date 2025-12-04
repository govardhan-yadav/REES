# Teacher Login + Quiz Upload System

Complete implementation of teacher authentication and AI-powered quiz creation system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `@aws-sdk/client-qbusiness` - Amazon Q Business integration

### 2. Configure Environment Variables

Edit `.env` file:

```env
# Server
PORT=3001

# Gemini API (existing chatbot)
GEMINI_API_KEY=your_gemini_key

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Amazon Q Business Configuration
AWS_REGION=us-east-1
Q_APP_ID=your_q_business_application_id
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

### 3. Start Server
```bash
npm start
```

Server runs on: http://localhost:3001

## 📚 Features

### Teacher Authentication
- **Login**: JWT-based authentication with bcrypt password hashing
- **Registration**: New teachers can self-register
- **Protected Routes**: Dashboard requires valid JWT token

### AI Question Generation (Amazon Q Business)
- Generate 5 MCQ questions automatically
- Specify: Class, Subject, Topic, Difficulty
- Questions follow NCERT curriculum standards
- Review and edit before saving

### Quiz Management
- Create quizzes with multiple questions
- Each question has:
  - Question text
  - 4 options
  - Correct answer index
  - Optional explanation
- View all your quizzes
- Delete quizzes

### Student Integration
- Public API endpoint: `GET /api/quizzes`
- Filter by class, subject, chapter
- Students can fetch and take quizzes

## 🔐 Demo Credentials

**Email**: teacher@demo.com  
**Password**: demo123

## 📡 API Endpoints

### Authentication
```
POST /api/auth/teacher/login
Body: { email, password }
Response: { success, token, teacher }

POST /api/auth/teacher/register
Body: { name, email, password }
Response: { success, token, teacher }
```

### Quiz Management (Protected - Requires JWT)
```
POST /api/quizzes
Headers: Authorization: Bearer <token>
Body: { className, subject, chapter, difficulty, questions[] }
Response: { success, quiz }

GET /api/quizzes/my
Headers: Authorization: Bearer <token>
Response: { success, quizzes[] }

DELETE /api/quizzes/:id
Headers: Authorization: Bearer <token>
Response: { success }
```

### AI Question Generation (Protected)
```
POST /api/quizzes/ai-suggest
Headers: Authorization: Bearer <token>
Body: { className, subject, topic, difficulty, notes }
Response: { success, questions[] }
```

### Public Endpoints (For Students)
```
GET /api/quizzes?className=Class%206&subject=Math&chapter=Fractions
Response: { success, quizzes[] }
```

## 📂 Data Structure

### Teacher Object
```javascript
{
  id: "seed_1",
  name: "Demo Teacher",
  email: "teacher@demo.com",
  password: "$2a$10$...", // bcrypt hashed
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Quiz Object
```javascript
{
  id: "q_1234567890",
  className: "Class 6",
  subject: "Mathematics",
  chapter: "Fractions",
  difficulty: "medium",
  questions: [
    {
      q: "What is 1/2 + 1/4?",
      options: ["1/6", "3/4", "2/6", "1/8"],
      answerIndex: 1,
      explanation: "1/2 = 2/4, so 2/4 + 1/4 = 3/4"
    }
  ],
  createdBy: "teacher@demo.com",
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Usage Flow

### For Teachers:
1. Open `teacher-login.html`
2. Login with credentials (or register)
3. Use AI generator to create questions:
   - Select class, subject, topic
   - Click "Generate Questions with AI"
   - Review and edit generated questions
4. Or add questions manually
5. Click "Save Quiz"
6. View all your quizzes in "My Quizzes" section

### For Students:
1. Your existing `student-quiz.html` can call:
```javascript
const response = await fetch('http://localhost:3001/api/quizzes?className=Class%206&subject=Math');
const data = await response.json();
const quizzes = data.quizzes;
```

2. Display questions from `quizzes[0].questions` array

## 🔧 Amazon Q Business Setup

### Prerequisites:
1. AWS Account with Q Business enabled
2. Create Q Business Application in AWS Console
3. Note the Application ID
4. Create IAM user with Q Business permissions
5. Generate access keys

### Configuration:
Add to `.env`:
```env
AWS_REGION=us-east-1
Q_APP_ID=your-app-id-here
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### Fallback Behavior:
If AWS Q Business is not configured, the system returns sample questions with a warning message. Teachers can still use the system by adding questions manually.

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds = 10
- **JWT Tokens**: 7-day expiration
- **Protected Routes**: Middleware validates JWT on sensitive endpoints
- **Authorization**: Teachers can only delete their own quizzes
- **Input Validation**: Server-side validation for all inputs

## 📁 File Structure

```
/
├── server.js                    # Main Express server
├── teacher-login.html           # Login/Registration page
├── teacher-dashboard.html       # Quiz creation dashboard
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── data/
│   ├── teachers.json           # Teacher accounts
│   └── quizzes.json            # All quizzes
└── README_TEACHER_SYSTEM.md    # This file
```

## 🐛 Troubleshooting

### "Cannot connect to server"
- Run `npm start` to start the server
- Check if port 3001 is available

### "Invalid token"
- Logout and login again
- Check if JWT_SECRET is set in .env

### "AI generation unavailable"
- Configure AWS Q Business credentials in .env
- Check AWS IAM permissions
- Verify Q Business Application ID

### Login not working
- Check console (F12) for errors
- Verify teachers.json exists in data/ folder
- Try registering a new account

## 🎓 Integration with Existing Student Quiz System

Your existing `student-quiz.html` needs minimal changes:

```javascript
// Fetch quizzes from API
async function loadQuizzes() {
  const response = await fetch('http://localhost:3001/api/quizzes?className=Class%206');
  const data = await response.json();
  
  if (data.success) {
    // data.quizzes is an array of quiz objects
    // Each quiz has: className, subject, chapter, questions[]
    displayQuizzes(data.quizzes);
  }
}

// Display a specific quiz
function displayQuiz(quiz) {
  quiz.questions.forEach((q, index) => {
    // q.q = question text
    // q.options = array of 4 options
    // q.answerIndex = correct answer (0-3)
    // q.explanation = optional explanation
    renderQuestion(q, index);
  });
}
```

## 📝 Notes

- This is a college project using JSON file storage
- For production, migrate to a real database (MongoDB, PostgreSQL)
- JWT secret should be strong and kept secure
- Consider adding email verification for teacher registration
- Add rate limiting for API endpoints in production

## 🎉 Success!

You now have a complete teacher system with:
✅ Secure authentication (JWT + bcrypt)
✅ AI-powered question generation (Amazon Q Business)
✅ Quiz creation and management
✅ Public API for student access
✅ Clean, minimal code structure

Happy teaching! 🎓
