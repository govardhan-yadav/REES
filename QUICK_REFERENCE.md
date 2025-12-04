# 🚀 Quick Reference Card

## Start Server
```bash
npm start
```

## URLs
- **Teacher Login:** http://localhost:3001/teacher-login.html
- **Teacher Dashboard:** http://localhost:3001/teacher-dashboard.html
- **Student Portal:** http://localhost:3001/student-quiz-example.html

## Demo Login
- **Email:** teacher@demo.com
- **Password:** demo123

## API Endpoints

### Public
```
GET  /api/quizzes                    # Get all quizzes
GET  /api/quizzes?className=Class%206  # Filter by class
GET  /api/chat                       # Gemini chatbot
```

### Protected (Add header: `Authorization: Bearer <token>`)
```
POST /api/auth/teacher/login         # Login
POST /api/auth/teacher/register      # Register
POST /api/quizzes                    # Create quiz
GET  /api/quizzes/my                 # Get my quizzes
DELETE /api/quizzes/:id              # Delete quiz
POST /api/quizzes/ai-suggest         # AI generate questions
```

## File Structure
```
server.js                    # Main server
teacher-login.html           # Login page
teacher-dashboard.html       # Dashboard
student-quiz-example.html    # Student portal
data/teachers.json           # Teachers
data/quizzes.json           # Quizzes
.env                        # Config
```

## Environment Variables (.env)
```env
PORT=3001
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_key_here

# Optional - for AI features
AWS_REGION=us-east-1
Q_APP_ID=your_app_id
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

## Common Commands
```bash
npm install              # Install dependencies
npm start               # Start server
node server.js          # Alternative start
```

## Data Structures

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
      q: "Question text?",
      options: ["A", "B", "C", "D"],
      answerIndex: 1,
      explanation: "Why B is correct"
    }
  ],
  createdBy: "teacher@demo.com",
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

### Teacher Object
```javascript
{
  id: "seed_1",
  name: "Demo Teacher",
  email: "teacher@demo.com",
  password: "$2a$10$...",  // bcrypt hash
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## Frontend Integration

### Fetch Quizzes
```javascript
const response = await fetch('http://localhost:3001/api/quizzes');
const data = await response.json();
const quizzes = data.quizzes;
```

### Create Quiz (with JWT)
```javascript
const token = localStorage.getItem('teacher_token');
const response = await fetch('http://localhost:3001/api/quizzes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    className: "Class 6",
    subject: "Math",
    chapter: "Fractions",
    difficulty: "medium",
    questions: [...]
  })
});
```

### Login
```javascript
const response = await fetch('http://localhost:3001/api/auth/teacher/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email, password})
});
const data = await response.json();
if(data.success) {
  localStorage.setItem('teacher_token', data.token);
  localStorage.setItem('teacher', JSON.stringify(data.teacher));
}
```

## Troubleshooting

### Server won't start
```bash
# Check if port is in use
netstat -ano | findstr :3001
```

### Login fails
- Check browser console (F12)
- Verify server is running
- Try registering new account

### AI generation fails
- Normal if AWS Q Business not configured
- System uses fallback sample questions
- Add questions manually instead

## Security Notes
- Passwords hashed with bcrypt
- JWT tokens expire in 7 days
- Change JWT_SECRET in production
- Teachers can only delete own quizzes

## Documentation Files
- `README_TEACHER_SYSTEM.md` - Full documentation
- `SETUP_GUIDE.md` - Setup instructions
- `DATA_TYPES.md` - Type reference
- `IMPLEMENTATION_SUMMARY.md` - Overview
- `QUICK_REFERENCE.md` - This file

## Key Features
✅ JWT Authentication  
✅ Bcrypt Password Hashing  
✅ AI Question Generation  
✅ Quiz CRUD Operations  
✅ Student Portal  
✅ Public API  
✅ Secure & Clean Code  

## Next Steps
1. Start server: `npm start`
2. Login: http://localhost:3001/teacher-login.html
3. Create quiz with AI or manually
4. Test in student portal
5. Integrate with your existing UI

---
**Need Help?** Check `SETUP_GUIDE.md` for detailed instructions.
