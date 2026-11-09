/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF8F0',
          100: '#F5EDD6',
          200: '#EBDAAE',
          300: '#DFC27E',
          400: '#D4AF5A',
          500: '#C59B3C',
          600: '#A97D2B',
          700: '#86601F',
          800: '#634719',
          900: '#432F12',
        },
        ink: {
          50: '#FAFAF8',
          100: '#F3F2EE',
          200: '#E5E3DC',
          300: '#CFCBC0',
          400: '#9C978A',
          500: '#6E6A60',
          600: '#524F47',
          700: '#3A3833',
          800: '#24231F',
          900: '#15140F',
        },
        success: {
          50: '#EEF8F1',
          500: '#2F8A52',
          700: '#1F6039',
        },
        error: {
          50: '#FDF1F0',
          500: '#C0392B',
          700: '#8E2A20',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        heading: '1.2',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
