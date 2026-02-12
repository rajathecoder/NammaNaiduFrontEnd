/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E20',
          light: '#4CAF50',
          dark: '#0D3B13',
        },
        gold: {
          DEFAULT: '#D4A017',
          light: '#F9A825',
          dark: '#B8860B',
        },
        kumkum: '#8B1A1A',
      },
    },
  },
  plugins: [],
}
