# Gemini AI Chatbot

Simple educational chatbot using Google's free Gemini API.

## Setup

1. Get free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Replace `YOUR_GEMINI_API_KEY_HERE` in `.env` file
3. Install: `npm install`
4. Start: `npm start`
5. Open: `http://localhost:3001/chatbot.html`

## Features

- Free Gemini 1.5 Flash model
- Educational focus (NCERT, courses)
- Simple web interface
- Error handling

## API

POST `/api/chat` with `{"message": "your question"}`