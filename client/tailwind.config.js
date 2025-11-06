/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css", 
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFD700',
        'brand-orange': '#FFA500',
        'brand-black': '#1a1a1a',
        'brand-white': '#FFFFFF',
      }
    },
  },
  plugins: [],
}