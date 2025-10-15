/**** Tailwind Config ****/
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#60a5fa',
          soft: '#93c5fd',
          deep: '#2563eb'
        },
        surface: {
          light: '#f8fafc',
          dark: '#0b1220'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
