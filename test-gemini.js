require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('Testing Gemini API with gemini-pro...');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('What is 2+2? Answer in one sentence.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Gemini replied:', text);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

testGemini();