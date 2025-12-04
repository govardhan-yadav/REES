# 🚀 Quick Setup Guide

## ✅ Installation Complete!

All dependencies have been installed. Follow these steps to get started:

## 1️⃣ Start the Server

```bash
npm start
```

You should see:
```
✅ Server running on http://localhost:3001
📚 Teacher Login: http://localhost:3001/teacher-login.html
🎓 Teacher Dashboard: http://localhost:3001/teacher-dashboard.html
```

## 2️⃣ Test Teacher Login

Open in browser: http://localhost:3001/teacher-login.html

**Demo Credentials:**
- Email: `teacher@demo.com`
- Password: `demo123`

## 3️⃣ Create Your First Quiz

### Option A: Use AI Generation (Requires AWS Q Business)

1. Fill in the AI Generator section:
   - Class: Select a class (e.g., Class 6)
   - Subject: e.g., "Mathematics"
   - Topic: e.g., "Fractions"
   - Difficulty: Easy/Medium/Hard
   - Notes: Optional context

2. Click "✨ Generate Questions with AI"

3. Review and edit the generated questions

4. Click "💾 Save Quiz"

### Option B: Add Questions Manually

1. Scroll to "Create Quiz" section
2. Fill in Class, Subject, Chapter, Difficulty
3. Click "+ Add Question Manually"
4. Enter question text and 4 options
5. Select the correct answer (radio button)
6. Add more questions as needed
7. Click "💾 Save Quiz"

## 4️⃣ View Student Portal

Open: http://localhost:3001/student-quiz-example.html

- Filter quizzes by class and subject
- Click on a quiz to start
- Answer questions
- Submit to see results

## 🔧 Configure Amazon Q Business (Optional)

If you want AI question generation, edit `.env`:

```env
AWS_REGION=us-east-1
Q_APP_ID=your_q_business_app_id_here
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
```

### How to get AWS Q Business credentials:

1. Go to AWS Console → Amazon Q Business
2. Create a new Application (or use existing)
3. Copy the Application ID
4. Create IAM user with Q Business permissions
5. Generate access keys
6. Add to `.env` file

**Note:** If AWS Q Business is not configured, the system will use sample questions as fallback.

## 📂 File Structure

```
/
├── server.js                      # Main server (JWT + AI integration)
├── teacher-login.html             # Teacher authentication
├── teacher-dashboard.html         # Quiz creation with AI
├── student-quiz-example.html      # Student portal example
├── package.json                   # Dependencies
├── .env                           # Configuration
├── data/
│   ├── teachers.json             # Teacher accounts (bcrypt hashed)
│   └── quizzes.json              # All quizzes
├── README_TEACHER_SYSTEM.md      # Full documentation
└── SETUP_GUIDE.md                # This file
```

## 🎯 Key Features Implemented

✅ **Teacher Authentication**
- JWT-based login/registration
- Bcrypt password hashing
- 7-day token expiration

✅ **AI Question Generation**
- Amazon Q Business integration
- Generates 5 MCQs per request
- NCERT curriculum aligned
- Fallback to manual entry

✅ **Quiz Management**
- Create/view/delete quizzes
- Multiple questions per quiz
- Class, subject, chapter organization
- Difficulty levels

✅ **Student Portal**
- Public API access
- Filter by class/subject
- Interactive quiz taking
- Instant grading with percentage

## 🔐 Security Features

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens for authentication
- Protected API endpoints
- Authorization checks (teachers can only delete own quizzes)
- Input validation on all endpoints

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill the process if needed
taskkill /PID <process_id> /F
```

### Login not working
- Check browser console (F12) for errors
- Verify `data/teachers.json` exists
- Try registering a new account
- Check if server is running

### AI generation not working
- This is normal if AWS Q Business is not configured
- System will show warning and provide sample questions
- You can still add questions manually
- Configure AWS credentials in `.env` to enable AI

## 📚 API Endpoints Reference

### Public (No Auth Required)
```
GET /api/quizzes
GET /api/quizzes?className=Class%206
GET /api/quizzes?subject=Mathematics
GET /api/chat (Gemini chatbot - existing)
```

### Protected (Requires JWT Token)
```
POST /api/auth/teacher/login
POST /api/auth/teacher/register
POST /api/quizzes
GET /api/quizzes/my
DELETE /api/quizzes/:id
POST /api/quizzes/ai-suggest
```

## 🎓 Next Steps

1. **Create more quizzes** for different classes and subjects
2. **Integrate with your existing student UI** using the API
3. **Configure AWS Q Business** for AI generation
4. **Add more teachers** via registration
5. **Customize styling** to match your school branding

## 💡 Tips

- Use AI generation to quickly create quiz templates
- Always review AI-generated questions before saving
- Add explanations to help students learn
- Organize quizzes by chapter for easy navigation
- Test quizzes in student portal before sharing

## 🎉 You're All Set!

Your teacher system is ready to use. Start creating quizzes and help students learn! 🚀

For detailed documentation, see: `README_TEACHER_SYSTEM.md`
