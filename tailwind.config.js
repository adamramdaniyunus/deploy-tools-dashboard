/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#00e6cb",
        "primary-dark": "#00b39e",
        "background-light": "#fafafa",
        "background-dark": "#131315",
        "surface-dark": "#1e1e21",
        "border-dark": "#2a2a2d",
        "terminal-bg": "#0d0d0f",
        // Keep existing semantic aliases for compatibility
        background: '#131315', // map to new background-dark
        surface: '#1e1e21',    // map to new surface-dark
        text: '#ffffff',
        textMuted: '#94a3b8',
        success: '#10b981',
        danger: '#ef4444',
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Space Grotesk", "sans-serif"],
        // Keep existing for compatibility if needed
        sans: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        "lg": "0.5rem",
        "xl": "0.75rem",
      },
    },
  },
  plugins: [],
}
