/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        structured: {
          day: '#F88E87',
          dawn: '#FF9E74',
          sunshine: '#EAAA00',
          nature: '#91BF6C',
          forest: '#228564',
          night: '#6185A8',
          twilight: '#974767',
          midnight: '#2C5073',
          classic: '#141414',
          neutral: '#EBEBEB',
          surface: '#3C3C43',
        },
        surface: {
          light: '#FFFFFF',
          lightSec: '#F8F8F8',
          lightElevated: '#F2F2F5',
          dark: '#1C1C1E',
          darkSec: '#242424',
          darkElevated: '#2C2C2E',
        },
        divider: {
          light: '#EBEBEB',
          dark: 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        'pill': '2.5rem',
      },
      boxShadow: {
        'apple': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'apple-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.09), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'popover': '0 12px 38px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
