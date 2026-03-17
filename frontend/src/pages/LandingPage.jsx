// /src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoomaNavbar2 from "../components/LoomaNavbar2.jsx";
import LoomaFooter from "../components/LoomaFooter.jsx";
import { useProject } from "../context/ProjectProvider.jsx";
import { parseProjectJson } from "../utils/parseProjectJson.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { useProjectStore } from "../store/useProjectStore.js";
import { sampleTemplates, templateCategories } from "../data/sampleTemplates.js";

// Typing placeholder hook
const useTypedPlaceholder = (texts, speed = 45, delay = 1400) => {
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    let timeout, loopTimeout;
    setPlaceholder("");

    const type = () => {
      if (i <= texts[index].length) {
        setPlaceholder(texts[index].slice(0, i));
        i++;
        timeout = setTimeout(type, speed);
      } else {
        loopTimeout = setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
        }, delay);
      }
    };

    type();
    return () => {
      clearTimeout(timeout);
      clearTimeout(loopTimeout);
    };
  }, [index, texts, speed, delay]);

  return placeholder;
};

// Smart Prompt Suggestion Engine
const usePromptSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Enhanced suggestion patterns
  const suggestionPatterns = {
    // Project types
    'blog': [
      "Add user authentication and comments",
      "Include categories and tags",
      "Add search functionality",
      "Include rich text editor",
      "Add social sharing buttons"
    ],
    'ecommerce': [
      "Add shopping cart and checkout",
      "Include product reviews and ratings",
      "Add payment integration (Stripe)",
      "Include admin dashboard",
      "Add inventory management"
    ],
    'dashboard': [
      "Add real-time analytics charts",
      "Include user management",
      "Add notification system",
      "Include dark/light theme",
      "Add data export functionality"
    ],
    'social': [
      "Add user profiles and followers",
      "Include real-time messaging",
      "Add post likes and comments",
      "Include image/video upload",
      "Add notification system"
    ],
    'portfolio': [
      "Add project gallery",
      "Include contact form",
      "Add blog section",
      "Include resume download",
      "Add dark mode toggle"
    ],
    
    // Tech stacks
    'mern': [
      "Add JWT authentication",
      "Include file upload with Multer",
      "Add pagination and filtering",
      "Include real-time features with Socket.io",
      "Add email service"
    ],
    'react': [
      "Add state management with Redux/Zustand",
      "Include responsive design",
      "Add routing with React Router",
      "Include API integration",
      "Add error boundaries"
    ],
    'node': [
      "Add REST API endpoints",
      "Include database integration",
      "Add authentication middleware",
      "Include error handling",
      "Add logging system"
    ],
    
    // Features
    'auth': [
      "Add social login (Google/GitHub)",
      "Include email verification",
      "Add password reset flow",
      "Include role-based access",
      "Add session management"
    ],
    'payment': [
      "Add Stripe payment integration",
      "Include subscription plans",
      "Add invoice generation",
      "Include payment history",
      "Add refund functionality"
    ]
  };

  // Common project starters
  const projectStarters = [
    "Build a MERN stack blog with user authentication and comments",
    "Create a React e-commerce site with shopping cart and Stripe payments",
    "Develop a social media platform with real-time messaging",
    "Build a dashboard with analytics charts and user management",
    "Create a portfolio website with project gallery and contact form",
    "Develop a task management app with drag-and-drop functionality",
    "Build a weather app with location detection and forecasts",
    "Create a recipe sharing platform with search and categories"
  ];

  const getSuggestions = (currentPrompt) => {
    if (!currentPrompt.trim()) {
      return projectStarters.slice(0, 4); // Show starters when empty
    }

    const prompt = currentPrompt.toLowerCase();
    const matchedSuggestions = new Set();

    // Detect patterns and add relevant suggestions
    Object.keys(suggestionPatterns).forEach(pattern => {
      if (prompt.includes(pattern)) {
        suggestionPatterns[pattern].forEach(suggestion => {
          matchedSuggestions.add(suggestion);
        });
      }
    });

    // Add tech stack recommendations based on prompt content
    if (prompt.includes('full stack') || prompt.includes('backend')) {
      matchedSuggestions.add("Use MERN stack (MongoDB, Express, React, Node.js)");
      matchedSuggestions.add("Add REST API with proper error handling");
    }

    if (prompt.includes('mobile') || prompt.includes('responsive')) {
      matchedSuggestions.add("Make it fully responsive for mobile devices");
      matchedSuggestions.add("Add touch-friendly interactions");
    }

    if (prompt.includes('real-time') || prompt.includes('live')) {
      matchedSuggestions.add("Add real-time features with WebSockets");
      matchedSuggestions.add("Include live notifications");
    }

    return Array.from(matchedSuggestions).slice(0, 6); // Limit to 6 suggestions
  };

  const updateSuggestions = (prompt) => {
    const newSuggestions = getSuggestions(prompt);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0 && prompt.length > 0);
  };

  return {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    updateSuggestions
  };
};

// Template Card Component with Lovable-inspired design
const TemplateCard = ({ template, onApply }) => {
  const { theme } = useThemeStore();
  
  const getComplexityColor = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 90) return 'from-green-400 to-emerald-500';
    if (popularity >= 80) return 'from-blue-400 to-cyan-500';
    return 'from-gray-400 to-gray-500';
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // ⚠️ CRITICAL: Prevent event bubbling
    console.log("🎯 Template button clicked:", template.title);
    if (onApply && typeof onApply === 'function') {
      onApply(template);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 transition-all duration-500 
      border border-gray-200/80 dark:border-gray-700/80 hover:border-transparent
      shadow-sm hover:shadow-2xl hover:scale-[1.02] overflow-hidden
      hover:bg-gradient-to-br hover:from-white hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900">
      
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      <div className="absolute inset-[2px] bg-white dark:bg-gray-800 rounded-3xl -z-10" />
      
      {/* Popularity Badge */}
      {template.popularity >= 90 && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="relative">
            <div className={`w-8 h-8 bg-gradient-to-r ${getPopularityColor(template.popularity)} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-white text-xs font-bold">🔥</span>
            </div>
          </div>
        </div>
      )}

      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${template.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
            <span className="text-white text-lg">{template.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 mb-1">
              {template.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                {template.complexity}
              </span>
              {template.tags?.includes('trending') && (
                <span className="px-2 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full text-xs font-medium">
                  Trending
                </span>
              )}
              {template.tags?.includes('featured') && (
                <span className="px-2 py-1 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
        {template.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {template.techStack.slice(0, 3).map((tech, index) => (
          <span 
            key={index}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs rounded-xl 
              border border-gray-200 dark:border-gray-600 font-medium backdrop-blur-sm
              group-hover:bg-white/80 group-hover:dark:bg-gray-700/80 transition-colors"
          >
            {tech}
          </span>
        ))}
        {template.techStack.length > 3 && (
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs rounded-xl border border-gray-200 dark:border-gray-600">
            +{template.techStack.length - 3}
          </span>
        )}
      </div>

      {/* Features */}
      <div className="space-y-2 mb-6">
        {template.features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
        {template.features.length > 3 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 pl-4">
            +{template.features.length - 3} more features
          </div>
        )}
      </div>

      {/* Apply Button - UPDATED WITH stopPropagation */}
      <button
        onClick={handleButtonClick}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
          text-white rounded-2xl font-semibold text-sm transition-all duration-300 
          shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group/btn
          border border-blue-400/20 relative z-10" // Added z-10
      >
        <span className="flex items-center justify-center gap-2">
          Use Template
          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
    </div>
  );
};

export default function LoomaLanding() {
  const navigate = useNavigate();
  const { setProject } = useProject();
  const { setFiles, setProjectName } = useProjectStore();
  const { theme, toggleTheme } = useThemeStore();

  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef(null);

  // Use the smart suggestions hook
  const { 
    suggestions, 
    showSuggestions, 
    setShowSuggestions, 
    updateSuggestions 
  } = usePromptSuggestions();

  // Filter templates by category
  const filteredTemplates = sampleTemplates.filter(template => 
    selectedCategory === "All" || template.category === selectedCategory
  );

  const placeholder = useTypedPlaceholder(
    [
      "Your project vision goes here...",
      "Build a MERN blog with login and comments.",
      "AI-powered SaaS dashboard, realtime updates.",
      "Stripe e-commerce app with admin panel.",
      "Generate a social network for developers.",
    ],
    40,
    1600
  );

  // Handle prompt changes
  const handlePromptChange = (e) => {
    const value = e.target.value;
    setUserPrompt(value);
    updateSuggestions(value);
  };

  // Apply suggestion to textarea
  const applySuggestion = (suggestion) => {
    setUserPrompt(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

// Apply template (load from backend templates folder)
// Apply template (load from backend templates folder)
const applyTemplate = async (template) => {
  console.log("🔄 applyTemplate called with:", template);
  
  try {
    setLoading(true);
    setError("");
    setShowTemplates(false);

    const projectName = template.id;
    console.log("📤 Creating project:", projectName);

    // 1. Copy template folder into backend/projects
    const token = localStorage.getItem('looma-auth') ? JSON.parse(localStorage.getItem('looma-auth'))?.state?.token : null;
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/templates/load`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({
        templateName: template.id,
        projectName
      }),
    });

    console.log("📥 Template load response status:", res.status);
    const data = await res.json();
    console.log("📥 Template load response:", data);
    
    if (!data.success) {
      throw new Error(data.error || "Failed to load template");
    }

    // 2. Fetch all files for workspace
    console.log("📁 Fetching files for workspace...");
    const fileRes = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/files?project=${projectName}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    const fileData = await fileRes.json();
    console.log("📁 Files fetched:", Object.keys(fileData.files || {}).length, "files");

    // 3. Push into global store
    
    setProjectName(projectName);
   
    setFiles(fileData.files);
    useProjectStore.getState().updateFileStructure(fileData.files);
    useProjectStore.getState().setProjectPath(data.path);

    console.log("✅ Template loaded, navigating to workspace...");
    navigate("/workspace");
  } catch (e) {
    console.error("❌ Error in applyTemplate:", e);
    setError(e.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


// Close suggestions when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (textareaRef.current && !textareaRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

async function handleGenerate() {
  setError("");
  if (!userPrompt.trim()) {
    setError("Please describe your project idea first.");
    return;
  }

  setLoading(true);
  setShowSuggestions(false); // Hide suggestions when generating
  
  try {
    const token = localStorage.getItem('looma-auth') ? JSON.parse(localStorage.getItem('looma-auth'))?.state?.token : null;
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ prompt: userPrompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Generation failed");

const parsed = parseProjectJson(data.content || "");

setProjectName(parsed.name);
setFiles(parsed.files);
useProjectStore.getState().setIsTemplate(false);
useProjectStore.getState().setProjectPath(data.projectPath);
if (data.projectId) useProjectStore.getState().setProjectId(data.projectId);

setProject({
  ...parsed,
  projectPath: data.projectPath
});
navigate("/workspace");




  } catch (e) {
    setError(e.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}

const cosmicBg =
  "bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900";
const cosmicOverlay = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
  backgroundSize: "20px 20px",
  opacity: 0.3,
  pointerEvents: "none",
  zIndex: 1,
};

return (
  <div
    className={`min-h-screen w-full relative font-['Inter','system-ui','sans-serif'] ${
      theme === 'dark' ? "dark bg-gray-900" : "bg-white"
    } transition-colors duration-300`}
  >
    <LoomaNavbar2 dark={theme === 'dark'} setDark={(isDark) => {
      if (isDark !== (theme === 'dark')) {
        toggleTheme();
      }
    }} />
    
    {/* Modern Background */}
    <div className={`absolute inset-0 z-0 transition-colors duration-300 ${cosmicBg}`} />
    <div className="absolute inset-0 z-0" style={cosmicOverlay} aria-hidden="true" />

    {/* Animated Gradient Orbs */}
    <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
    <div className="absolute top-1/3 -right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75" />
    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150" />

    <section
      className="z-10 relative flex flex-col items-center justify-center py-20 md:py-28 px-4 min-h-screen"
    >
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
          Build the Impossible
          <br />
          <span className="text-3xl md:text-5xl font-light">Just prompt it.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 font-light leading-relaxed">
          Describe your idea, and Looma delivers the code. 
          <span className="block text-lg text-gray-500 dark:text-gray-400 mt-2">
            From simple components to full-stack applications.
          </span>
        </p>
      </div>

      {/* Main Input Card */}
      <div className="w-full max-w-4xl mx-auto mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  spellCheck="false"
                  placeholder={placeholder}
                  value={userPrompt}
                  onChange={handlePromptChange}
                  onFocus={() => updateSuggestions(userPrompt)}
                  className="w-full min-h-[140px] text-gray-900 dark:text-white text-lg font-normal rounded-2xl px-6 py-5 
                    bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm
                    placeholder-gray-400 dark:placeholder-gray-500 
                    border border-gray-200 dark:border-gray-600 
                    focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                    transition-all duration-300 resize-none"
                  style={{ letterSpacing: "0.01em" }}
                />

                {/* Smart Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto backdrop-blur-lg">
                    <div className="p-3">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Smart Suggestions
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full text-left px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                  text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-2 min-w-[140px] justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Gallery Section */}
      <div className="w-full max-w-7xl mx-auto">
        {/* Template Gallery Toggle */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="group px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
              font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 
              border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600
              hover:scale-105 flex items-center gap-3"
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transform transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
            {showTemplates ? "Hide Templates" : "Explore Templates"}
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500">
              {showTemplates ? "↑" : "↓"}
            </span>
          </button>

          {/* Quick Start Examples */}
          {!showTemplates && (
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "E-commerce store",
                "Blog with comments", 
                "Social media app",
                "Dashboard analytics",
                "Portfolio website"
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setUserPrompt(`Build a ${example} with modern UI and features`);
                    updateSuggestions(`Build a ${example} with modern UI and features`);
                  }}
                  className="px-5 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 
                    font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 
                    border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600
                    hover:scale-105 backdrop-blur-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Template Gallery */}
        {showTemplates && (
          <div className="animate-fade-in">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {templateCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                  } hover:scale-105 backdrop-blur-sm`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onApply={applyTemplate}
                  isLoading={loading}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No templates found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Try selecting a different category
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
    <div className="relative z-30 py-12 px-4 text-center"><LoomaFooter /></div>
  </div>
);
}