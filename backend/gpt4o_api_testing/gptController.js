const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is in your .env file
});

const prompt = `
Generate a complete MERN stack app with user login, dashboard, and Stripe payment integration.

Give the full working code for each file in a JSON format like:
{
  "project": "Project Name",
  "structure": {
    "backend/server.js": "code here...",
    "frontend/src/App.js": "code here...",
    ...
  }
}

Also include a clear and complete directory structure. I'm a beginner so assume I know nothing — explain what each file does in comments.
`;

async function run() {
  try {
    const response = await openai.chat.completions.create({
      // model: 'gpt-4.1-2025-04-14',
      model: 'gpt-4.1 (long context)',
      messages: [
        {
          role: 'system',
          content:
            'You are a full-stack coding assistant. Return JSON output with complete code structure and working code for each file.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    console.log('\n✅ === Response ===\n');
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error calling OpenAI:', error.response?.data || error.message);
  }
}

run();