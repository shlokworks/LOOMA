const { generateHtmlProject } = require('./gptService');
const { generateReactProject } = require('./reactGptService');

async function routeProjectRequest(userPrompt) {
  const lowerPrompt = userPrompt.toLowerCase();
  
  const isReactRequest = 
    lowerPrompt.includes('react') ||
    lowerPrompt.includes('jsx') ||
    lowerPrompt.includes('component') ||
    lowerPrompt.includes('usestate') ||
    lowerPrompt.includes('useeffect') ||
    /build a react|create a react|make a react/i.test(userPrompt);

  // ✅ ADD PORTFOLIO DETECTION
  const isPortfolioRequest = 
    lowerPrompt.includes('portfolio') ||
    lowerPrompt.includes('personal website') ||
    lowerPrompt.includes('about me') ||
    lowerPrompt.includes('project gallery');

  const isNextJSRequest = 
    lowerPrompt.includes('next.js') ||
    lowerPrompt.includes('nextjs') ||
    lowerPrompt.includes('next js');

  const isVanillaJSRequest = 
    (lowerPrompt.includes('javascript') || lowerPrompt.includes('js')) &&
    !isReactRequest &&
    !isNextJSRequest;

  console.log(`🔄 Routing request: ${isReactRequest ? 'REACT' : isNextJSRequest ? 'NEXTJS' : isVanillaJSRequest ? 'VANILLA JS' : 'HTML'} ${isPortfolioRequest ? '(PORTFOLIO)' : ''}`);

  // For React, Next.js, and Portfolio projects, use React generator
  if (isReactRequest || isNextJSRequest || isPortfolioRequest) {
    return await generateReactProject(userPrompt);
  } 
  // For vanilla JS and HTML, use HTML generator
  else {
    return await generateHtmlProject(userPrompt);
  }
}

module.exports = { routeProjectRequest };