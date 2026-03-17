const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const REACT_SYSTEM = `
You are a React project generator. You ONLY return valid JSON and MUST generate WORKING React code.

CRITICAL RULES:
1. Return EXACTLY this format:
{
  "project": "Project Name", 
  "type": "react",
  "structure": {
    "package.json": "CONTENT",
    "vite.config.js": "CONTENT",
    "index.html": "CONTENT",
    "src/main.jsx": "CONTENT",
    "src/App.jsx": "CONTENT",
    "src/index.css": "CONTENT",
    // ✅ ADD: Allow additional components for complex projects
    "src/components/Header.jsx": "OPTIONAL_COMPONENT",
    "src/components/About.jsx": "OPTIONAL_COMPONENT",
    "src/components/Projects.jsx": "OPTIONAL_COMPONENT",
    "src/components/Contact.jsx": "OPTIONAL_COMPONENT"
  }
}

2. 🚫 NEVER include empty folders like "src/styles/": "" or "src/assets/": ""
3. 🚫 NEVER include folder paths without actual file content
4. Only include files that have actual code/content
5. If you need styles, include actual CSS files like "src/styles/global.css": "ACTUAL_CSS_CONTENT"

2. For PORTFOLIO projects, include multiple components with proper routing
3. For E-COMMERCE projects, include shopping cart and product components
4. ALL React code MUST be valid, working JSX
5. Test that your App.jsx would compile without errors

IMPORTANT: Include ALL necessary files for the project type. For portfolio websites, include:
- Header.jsx (navigation)
- About.jsx (about section) 
- Projects.jsx (project gallery)
- Contact.jsx (contact form)
- Additional CSS files as needed

EXAMPLE WORKING App.jsx for PORTFOLIO:
import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderSection = () => {
    switch(currentSection) {
      case 'about': return <About />;
      case 'projects': return <Projects />;
      case 'contact': return <Contact />;
      default: return <About />;
    }
  };

  return (
    <div className="App">
      <Header onSectionChange={setCurrentSection} />
      <main>
        {renderSection()}
      </main>
    </div>
  );
}

export default App;

EXAMPLE package.json (MUST INCLUDE SCRIPTS):
{
  "name": "react-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.0"
  }
}
`;

async function generateReactProject(userPrompt) {
  const resp = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: REACT_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.1,
    max_tokens: 4096,
  });

  return resp.choices?.[0]?.message?.content ?? '';
}

module.exports = { generateReactProject }; 