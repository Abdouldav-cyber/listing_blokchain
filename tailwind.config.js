/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#f5f5f5',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a1a1a1',
          400: '#7a7a7a',
          500: '#5a5a5a',
          600: '#3e3e3e',
          700: '#2b2b2b',
          800: '#1a1a1a',
          900: '#0c0c0c',
        }
      }
    },
  },
  plugins: [],
}

// tailwind.config.js

