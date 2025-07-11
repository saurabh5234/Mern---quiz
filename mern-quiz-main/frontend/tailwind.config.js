/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [],
  extend: {
    animation: {
      'spin-slow': 'spin 2s linear infinite',
      'spin-slower': 'spin 5s linear infinite'
    }
  }
}
