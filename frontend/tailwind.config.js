/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfb',
          100: '#f9f7f5',
          200: '#f3f1ed',
          300: '#e9e6e1',
          400: '#dcd8d2',
          500: '#cac5bc',
        },
        navy: {
          50: '#eef1f6',
          100: '#dbe2eb',
          200: '#a9b8cc',
          300: '#6b89a3',
          400: '#3b5d7a',
          500: '#253b56',
          600: '#1e3049',
          700: '#18253a',
          800: '#121c2d',
          900: '#0c121f',
        },
        emerald: {
          50: '#e6f5f1',
          100: '#c2e9db',
          200: '#8ed3b9',
          300: '#5bbd97',
          400: '#37a57b',
          500: '#228b63',
          600: '#1c7251',
          700: '#175b42',
          800: '#114633',
          900: '#0c3225',
        },
               charcoal: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d', // Base charcoal
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1e21',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Base emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        amber: {
          25: '#fffbeb', // Your light cream color
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Base amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // Base rose
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        charcoal: '#2c2c2c',
        softwhite: '#fcfbf9',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 4px rgba(0,0,0,0.04)',
        soft: '0 3px 8px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};

