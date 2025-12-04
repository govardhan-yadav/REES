require('dotenv').config();
const fetch = require('node-fetch');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'What is 2+2?' }] }]
    })
  });

  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
  
  if (data.candidates) {
    console.log('\n✅ SUCCESS! Reply:', data.candidates[0].content.parts[0].text);
  }
}

test().catch(console.error);