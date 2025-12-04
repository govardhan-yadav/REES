# Gemini API Setup Guide

## 1. Get Your Free Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## 2. Configure Your Project

1. Open the `.env` file in your project
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## 3. Install Dependencies

Run this command in your project directory:
```bash
npm install
```

## 4. Start the Server

```bash
npm start
```
or for development:
```bash
npm run dev
```

## 5. Test the Chatbot

The chatbot will be available at `http://localhost:3001/api/chat`

You can test it by sending a POST request with:
```json
{
  "message": "Tell me about Class 10 mathematics"
}
```

## Features

- **Free Gemini AI**: Uses Google's free Gemini 1.5 Flash model
- **Local Fallback**: If AI fails, returns relevant NCERT books/videos
- **Rate Limited**: 60 requests per minute to prevent abuse
- **Secure**: Basic security headers and CORS protection

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Main chatbot endpoint
- `GET /api/videos` - Get all videos
- `GET /api/books` - Get all books
- `POST /api/progress` - Save quiz progress
- `GET /api/progress/summary` - Get progress summary

## Gemini API Limits (Free Tier)

- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

The code includes error handling to fall back to local responses if limits are exceeded.