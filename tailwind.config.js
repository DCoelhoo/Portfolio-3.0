/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0d',
        card: '#121216',
        muted: '#a0a0b2',
        accent: '#00e0ff',
      },
    },
  },
  plugins: [],
}