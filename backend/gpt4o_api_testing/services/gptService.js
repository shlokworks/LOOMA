const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const HTML_SYSTEM = `
You are an HTML/CSS/JavaScript generator. You ONLY return valid JSON.

CRITICAL RULES:
1. Return EXACTLY this format:
{
  "project": "Project Name",
  "type": "html", 
  "structure": {
    "index.html": "COMPLETE_HTML_CODE"
  }
}

2. HTML must be PROPERLY FORMATTED with indentation and line breaks
3. Include ALL CSS and JavaScript INSIDE the HTML file
4. HTML must be COMPLETE and VALID with proper doctype, html, head, body tags
5. Use vanilla JavaScript only - no React, no JSX
6. Format the HTML for readability with proper indentation

EXAMPLE FORMAT:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Title</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
    </style>
</head>
<body>
    <h1>Your Content Here</h1>
    <script>
        // Your JavaScript here
    </script>
</body>
</html>
`;

async function generateHtmlProject(userPrompt) {
  const resp = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: HTML_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  });

  return resp.choices?.[0]?.message?.content ?? '';
}

module.exports = { generateHtmlProject };