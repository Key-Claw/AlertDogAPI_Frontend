/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f4ff',
          100: '#f0e8ff',
          200: '#dfceff',
          300: '#c7a9ff',
          400: '#aa78ff',
          500: '#8f4dff',
          600: '#7e31f6',
          700: '#6a22d8',
          800: '#551fb0',
          900: '#411b84',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(81, 31, 176, 0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(120deg, #f8f4ff 0%, #eef4ff 100%)',
      },
    },
  },
  plugins: [],
};