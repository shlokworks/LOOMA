/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7C3AED",   // main Udemy-style purple
          pink: "#EC4899"      // softer accent tone
        }
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.08)",
        md: "0 4px 8px rgba(0,0,0,0.12)",
      }
    }
  },
  plugins: [],
};
