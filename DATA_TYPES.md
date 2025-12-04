# Data Types Reference

TypeScript-style interfaces for all data structures used in the system.

## Teacher

```typescript
interface Teacher {
  id: string;              // Unique ID (e.g., "seed_1", "1234567890")
  name: string;            // Full name
  email: string;           // Email (unique, used for login)
  password: string;        // Bcrypt hashed password
  createdAt: string;       // ISO date string
}
```

**Example:**
```json
{
  "id": "seed_1",
  "name": "Demo Teacher",
  "email": "teacher@demo.com",
  "password": "$2a$10$8K1p/a0dL3.I9/YS5sssmu.CdneOXo98qC5.Xz8Vb0xpl6pjsQ66i",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Quiz

```typescript
interface Quiz {
  id: string;              // Unique ID (e.g., "q_1234567890")
  className: string;       // e.g., "Class 6", "Class 10"
  subject: string;         // e.g., "Mathematics", "Science"
  chapter: string;         // e.g., "Chapter 1 - Fractions"
  difficulty: string;      // "easy" | "medium" | "hard"
  questions: Question[];   // Array of question objects
  createdBy: string;       // Teacher email
  createdAt: string;       // ISO date string
}
```

**Example:**
```json
{
  "id": "q_1705320000000",
  "className": "Class 6",
  "subject": "Mathematics",
  "chapter": "Fractions",
  "difficulty": "medium",
  "questions": [...],
  "createdBy": "teacher@demo.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## Question

```typescript
interface Question {
  q: string;               // Question text
  options: string[];       // Array of 4 options
  answerIndex: number;     // Index of correct answer (0-3)
  explanation?: string;    // Optional explanation
}
```

**Example:**
```json
{
  "q": "What is 1/2 + 1/4?",
  "options": ["1/6", "3/4", "2/6", "1/8"],
  "answerIndex": 1,
  "explanation": "1/2 = 2/4, so 2/4 + 1/4 = 3/4"
}
```

## JWT Payload

```typescript
interface JWTPayload {
  id: string;              // Teacher ID
  email: string;           // Teacher email
  name: string;            // Teacher name
  iat: number;             // Issued at (timestamp)
  exp: number;             // Expiration (timestamp)
}
```

**Example:**
```json
{
  "id": "seed_1",
  "email": "teacher@demo.com",
  "name": "Demo Teacher",
  "iat": 1705320000,
  "exp": 1705924800
}
```

## API Request/Response Types

### Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### Login Response
```typescript
interface LoginResponse {
  success: boolean;
  token?: string;          // JWT token (if success)
  teacher?: {              // Teacher info (if success)
    id: string;
    name: string;
    email: string;
  };
  error?: string;          // Error message (if failed)
}
```

### Register Request
```typescript
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
```

### Register Response
```typescript
interface RegisterResponse {
  success: boolean;
  token?: string;          // JWT token (if success)
  teacher?: {              // Teacher info (if success)
    id: string;
    name: string;
    email: string;
  };
  error?: string;          // Error message (if failed)
}
```

### Create Quiz Request
```typescript
interface CreateQuizRequest {
  className: string;
  subject: string;
  chapter: string;
  difficulty: string;
  questions: Question[];
}
```

### Create Quiz Response
```typescript
interface CreateQuizResponse {
  success: boolean;
  quiz?: Quiz;             // Created quiz (if success)
  error?: string;          // Error message (if failed)
}
```

### AI Suggest Request
```typescript
interface AISuggestRequest {
  className: string;
  subject: string;
  topic: string;
  difficulty?: string;
  notes?: string;
}
```

### AI Suggest Response
```typescript
interface AISuggestResponse {
  success: boolean;
  questions?: Question[];  // Generated questions (if success)
  warning?: string;        // Warning message (e.g., AI unavailable)
  error?: string;          // Error message (if failed)
}
```

### Get Quizzes Response
```typescript
interface GetQuizzesResponse {
  success: boolean;
  quizzes: Quiz[];         // Array of quizzes
}
```

## LocalStorage Data

### teacher_token
```typescript
type TeacherToken = string;  // JWT token string
```

**Example:**
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlZWRfMSIsImVtYWlsIjoidGVhY2hlckBkZW1vLmNvbSIsIm5hbWUiOiJEZW1vIFRlYWNoZXIiLCJpYXQiOjE3MDUzMjAwMDAsImV4cCI6MTcwNTkyNDgwMH0.abc123..."
```

### teacher
```typescript
interface TeacherLocalStorage {
  id: string;
  name: string;
  email: string;
}
```

**Example:**
```json
{
  "id": "seed_1",
  "name": "Demo Teacher",
  "email": "teacher@demo.com"
}
```

## File Storage Format

### data/teachers.json
```typescript
type TeachersFile = Teacher[];
```

**Example:**
```json
[
  {
    "id": "seed_1",
    "name": "Demo Teacher",
    "email": "teacher@demo.com",
    "password": "$2a$10$...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "1705320000000",
    "name": "John Smith",
    "email": "john@school.com",
    "password": "$2a$10$...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### data/quizzes.json
```typescript
type QuizzesFile = Quiz[];
```

**Example:**
```json
[
  {
    "id": "q_1705320000000",
    "className": "Class 6",
    "subject": "Mathematics",
    "chapter": "Fractions",
    "difficulty": "medium",
    "questions": [
      {
        "q": "What is 1/2 + 1/4?",
        "options": ["1/6", "3/4", "2/6", "1/8"],
        "answerIndex": 1,
        "explanation": "1/2 = 2/4, so 2/4 + 1/4 = 3/4"
      }
    ],
    "createdBy": "teacher@demo.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## Validation Rules

### Teacher
- `email`: Must be valid email format, unique
- `password`: Minimum 6 characters (plain text), stored as bcrypt hash
- `name`: Required, non-empty string

### Quiz
- `className`: Must be one of "Class 1" through "Class 10"
- `subject`: Required, non-empty string
- `chapter`: Required, non-empty string
- `difficulty`: Must be "easy", "medium", or "hard"
- `questions`: Array with at least 1 question

### Question
- `q`: Required, non-empty string
- `options`: Array of exactly 4 strings, all non-empty
- `answerIndex`: Integer between 0 and 3 (inclusive)
- `explanation`: Optional string

## Constants

```typescript
const CLASSES = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
];

const DIFFICULTIES = ["easy", "medium", "hard"];

const JWT_EXPIRY = "7d";  // 7 days

const BCRYPT_SALT_ROUNDS = 10;

const OPTIONS_PER_QUESTION = 4;
```

## Usage Examples

### Creating a Quiz (Frontend)
```javascript
const quizData = {
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
  ]
};

const response = await fetch('http://localhost:3001/api/quizzes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify(quizData)
});

const result = await response.json();
// result: { success: true, quiz: {...} }
```

### Fetching Quizzes (Frontend)
```javascript
const response = await fetch(
  'http://localhost:3001/api/quizzes?className=Class%206&subject=Mathematics'
);
const result = await response.json();
// result: { success: true, quizzes: [...] }

result.quizzes.forEach(quiz => {
  console.log(quiz.className, quiz.subject, quiz.chapter);
  quiz.questions.forEach(q => {
    console.log(q.q, q.options, q.answerIndex);
  });
});
```

This reference provides complete type information for all data structures in the system.
