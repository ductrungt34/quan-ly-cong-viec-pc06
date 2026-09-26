/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          red: '#c9141d',
          gold: '#f59e0b',
          blue: '#1e3a8a',
          dark: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'Tinos', '"Noto Serif"', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'Tinos', '"Noto Serif"', 'serif'],
      }
    },
  },
  plugins: [],
}

