// App.jsx
import { useEffect } from "react";
import { useProjectStore } from "./store/useProjectStore";
import { useThemeStore } from "./store/useThemeStore";
import AppRoutes from "./AppRoutes";

const dummyFiles = {
  "/src/App.jsx": `
    import React from 'react';
    import './index.css';
    export default function App() {
      return <h1 className="text-3xl text-blue-600">Hello from Vite + React!</h1>;
    }
  `,
  "/src/index.css": `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `,
  "/src/main.jsx": `
    import React from "react";
    import ReactDOM from "react-dom/client";
    import App from "./App";

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  `,
  "/index.html": `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
    </html>
  `,
};

function App() {
  const setFiles = useProjectStore((state) => state.setFiles);
  const setProjectName = useProjectStore((state) => state.setProjectName);
  const { theme } = useThemeStore();

  useEffect(() => {
    // ✅ Only load dummy files if no project exists in Zustand.
    const currentFiles = useProjectStore.getState().files;
    if (!currentFiles || Object.keys(currentFiles).length === 0) {
      setProjectName("Test Project");
      setFiles(dummyFiles);
    }
  }, [setFiles, setProjectName]);

  // Apply theme to entire document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Also update localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={theme}>
      <AppRoutes />
    </div>
  );
}

export default App;