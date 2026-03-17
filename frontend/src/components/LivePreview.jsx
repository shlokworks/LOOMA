 import React, { useMemo, useState, useEffect } from "react";
import { useSafeStore } from "../store/useSafeStore";
import { ErrorBoundary } from "react-error-boundary";

export default function LivePreview() {
  const files = useSafeStore((s) => s.files);
  const [iframeKey, setIframeKey] = useState(0);
  const [runningProject, setRunningProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        🧩 Waiting for project files...
      </div>
    );
  }

  // Detect project type - FIXED to handle nested paths
  const projectType = useMemo(() => {
    const fileNames = Object.keys(files);
    
    const hasReact = fileNames.some(f => 
      f.endsWith('.jsx') || 
      f.includes('package.json') ||
      f.includes('vite.config.js')
    );
    
    const hasHTML = fileNames.some(f => f.endsWith('.html'));
    const hasJS = fileNames.some(f => f.endsWith('.js') && !f.endsWith('.json'));
    
    if (hasReact) return 'react';
    if (hasHTML) return 'html';
    if (hasJS) return 'javascript';
    return 'other';
  }, [files]);

  // Find the main HTML file - FIXED for nested paths
  const mainHtmlFile = useMemo(() => {
    const htmlFiles = Object.keys(files).filter(f => f.endsWith('.html'));
    
    // Prefer index.html, otherwise take the first HTML file
    const indexHtml = htmlFiles.find(f => f.includes('index.html'));
    return indexHtml || htmlFiles[0] || null;
  }, [files]);

  // Get display file names without project folder for cleaner display
  const displayFileNames = useMemo(() => {
    return Object.keys(files)
      .filter(path => !path.endsWith('/')) // Exclude folders
      .map(path => {
        // Extract just the filename for display
        const parts = path.split('/');
        return parts[parts.length - 1];
      })
      .join(', ');
  }, [files]);

  // React project runner functions
  const getToken = () => {
    try { return JSON.parse(localStorage.getItem('looma-auth'))?.state?.token || null; }
    catch { return null; }
  };

  const handleRunReactProject = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/run-react-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          files: files,
          projectName: 'react-app'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRunningProject(result);
        window.open(result.url, '_blank');
      } else {
        alert('Failed to start project: ' + result.error);
      }
    } catch (error) {
      alert('Error starting project: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopProject = async () => {
    if (runningProject) {
      const token = getToken();
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/stop-react-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ projectId: runningProject.projectId })
      });
      setRunningProject(null);
    }
  };

  // Enhanced HTML content generation - FIXED for nested paths
  const htmlContent = useMemo(() => {
    const normalized = {};
    
    // Normalize all files - extract content regardless of folder structure
    for (const [key, content] of Object.entries(files)) {
      if (!key.endsWith('/')) { // Only process files, not folders
        normalized[key] = typeof content === "string" ? content : String(content);
      }
    }

    console.log("📁 Files for preview:", Object.keys(normalized), "Type:", projectType);

    // 🚀 REACT PROJECTS - Show helpful instructions
    if (projectType === 'react') {
      // Find App component in any nested structure
      let appCode = '// No App component found';
      Object.entries(normalized).forEach(([path, content]) => {
        if (path.includes('App.jsx') || path.includes('App.js')) {
          appCode = content;
        }
      });
      
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Project Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .header {
      background: #20232a;
      color: #61dafb;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .header p {
      color: #fff;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    .code-preview {
      background: #282c34;
      border-radius: 8px;
      overflow: hidden;
    }
    .code-header {
      background: #1e2227;
      color: #abb2bf;
      padding: 15px 20px;
      font-weight: bold;
      border-bottom: 1px solid #3e4451;
    }
    .code-content {
      padding: 20px;
      color: #abb2bf;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.4;
      max-height: 400px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
    .instructions {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 8px;
    }
    .steps {
      margin: 20px 0;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border-left: 4px solid #61dafb;
    }
    .step-number {
      background: #61dafb;
      color: #20232a;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 12px;
      flex-shrink: 0;
      font-size: 14px;
    }
    code {
      background: #e9ecef;
      color: #d63384;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    .note {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    .files-list {
      background: white;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
    .file-item {
      padding: 8px 12px;
      margin: 5px 0;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 3px solid #61dafb;
    }
    .live-badge {
      background: #10b981;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚛️ React Project Ready! ${runningProject ? '<span class="live-badge">LIVE</span>' : ''}</h1>
      <p>Your React application code is shown below</p>
    </div>
    
    <div class="content">
      <div class="code-preview">
        <div class="code-header">App.jsx</div>
        <div class="code-content">${escapeHtml(appCode)}</div>
      </div>
      
      <div class="instructions">
        <h3>🚀 How to Run Your React App</h3>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div>
              <strong>Download all files</strong>
              <p style="font-size: 14px; margin-top: 5px;">Save all generated files to a folder</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div>
              <strong>Install dependencies</strong>
              <p style="font-size: 14px; margin-top: 5px;">Run: <code>npm install</code></p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div>
              <strong>Start development server</strong>
              <p style="font-size: 14px; margin-top: 5px;">Run: <code>npm run dev</code></p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">4</div>
            <div>
              <strong>View your app</strong>
              <p style="font-size: 14px; margin-top: 5px;">Open browser to <code>http://localhost:5173</code></p>
            </div>
          </div>
        </div>

        <div class="note">
          <strong>💡 Note:</strong> React projects require Node.js and a local development server. 
          Download the files and run locally to see the live app.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    }

    // ✅ HTML PROJECTS - Use directly
    if (mainHtmlFile && normalized[mainHtmlFile]) {
      return normalized[mainHtmlFile];
    }

    // ✅ VANILLA JAVASCRIPT PROJECTS - Wrap in HTML
    const jsFiles = Object.entries(normalized)
      .filter(([path]) => path.endsWith('.js'))
      .map(([path, content]) => ({ path, content }));

    const cssFiles = Object.entries(normalized)
      .filter(([path]) => path.endsWith('.css'))
      .map(([path, content]) => ({ path, content }));

    if (jsFiles.length > 0) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript App</title>
  <style>
    body { 
      font-family: system-ui, sans-serif; 
      padding: 20px;
      background: #f5f5f5;
      line-height: 1.6;
    }
    .output { 
      background: white; 
      padding: 20px; 
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #007acc;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    ${cssFiles.map(css => css.content).join('\n')}
  </style>
</head>
<body>
  <h1>🚀 JavaScript Application</h1>
  <div class="output" id="output">
    <p><em>Console output will appear here...</em></p>
  </div>
  
  <script>
    // Override console.log to display in the page
    const originalLog = console.log;
    const outputDiv = document.getElementById('output');
    
    console.log = function(...args) {
      originalLog.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = 'margin: 10px 0; padding: 12px; background: #e3f2fd; border-radius: 6px; border-left: 4px solid #2196f3;';
      messageDiv.textContent = message;
      
      // Remove the initial "waiting" message
      if (outputDiv.innerHTML.includes('<em>Console output will appear here...</em>')) {
        outputDiv.innerHTML = '';
      }
      
      outputDiv.appendChild(messageDiv);
    };

    console.error = function(...args) {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'margin: 10px 0; padding: 12px; background: #ffebee; border-radius: 6px; border-left: 4px solid #f44336; color: #c62828;';
      errorDiv.textContent = 'ERROR: ' + message;
      
      if (outputDiv.innerHTML.includes('<em>Console output will appear here...</em>')) {
        outputDiv.innerHTML = '';
      }
      
      outputDiv.appendChild(errorDiv);
    };

    // Load and execute the JavaScript files
    ${jsFiles.map(js => 
      `try {
        // Executing: ${js.path}
        ${js.content}
      } catch (error) {
        console.error('Error in ${js.path}:', error.message);
      }`
    ).join('\n\n')}
  </script>
</body>
</html>`;
    }

    // 🔄 FALLBACK - Show all files
    let bodyContent = "";
    for (const [path, content] of Object.entries(normalized)) {
      if (path.endsWith('.html')) {
        bodyContent += `<div style="margin: 20px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #333; margin-bottom: 15px;">${path}</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef;">${content}</div>
        </div>`;
      } else {
        bodyContent += `<div style="margin: 20px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #333; margin-bottom: 15px;">${path}</h3>
          <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 6px; overflow-x: auto; font-family: 'Monaco', 'Consolas', monospace;">${escapeHtml(content)}</pre>
        </div>`;
      }
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Files</title>
  <style>
    body { 
      font-family: system-ui, sans-serif; 
      padding: 20px;
      background: #f5f5f5;
    }
  </style>
</head>
<body>
  <h1 style="color: #333; margin-bottom: 30px;">📂 Project Files</h1>
  ${bodyContent || '<p style="padding: 20px; background: white; border-radius: 8px;">No preview available</p>'}
</body>
</html>`;
  }, [files, projectType, runningProject, mainHtmlFile]);

  // Refresh iframe when content changes
  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [htmlContent]);

  const previewLabels = {
    'react': runningProject ? 'React (Live!)' : 'React (Code Preview)',
    'html': 'HTML',
    'javascript': 'JavaScript',
    'other': 'Code'
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="text-red-500 p-4 text-sm bg-red-50 rounded border border-red-200">
          ⚠️ Something went wrong in the live preview.
        </div>
      }
    >
      <div className="h-full flex flex-col">
        <div className="text-xs text-gray-600 p-3 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
          <span className="font-medium">
            Preview: <span className="text-blue-600 dark:text-blue-400">{previewLabels[projectType]}</span> | 
            Files: <span className="text-green-600 dark:text-green-400">{displayFileNames}</span>
          </span>
          <div className="flex gap-2">
            {projectType === 'react' && (
              runningProject ? (
                <div className="flex gap-2">
                  <a 
                    href={runningProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors font-medium"
                  >
                    🌐 Open Live
                  </a>
                  <button 
                    onClick={handleStopProject}
                    className="px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors font-medium"
                  >
                    ⏹️ Stop
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleRunReactProject}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors font-medium disabled:bg-gray-400"
                >
                  {isLoading ? '🚀 Starting...' : '🚀 Run Project'}
                </button>
              )
            )}
            <button 
              onClick={() => setIframeKey(prev => prev + 1)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <iframe
            key={iframeKey}
            srcDoc={htmlContent}
            title="Live Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}