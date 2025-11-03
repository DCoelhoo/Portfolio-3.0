/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
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
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}