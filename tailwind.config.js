tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f9fd',
          100: '#ecf3fc',
          200: '#dae8f9',
          300: '#c8ddf6',
          400: '#b6d2f3',
          500: '#4a90e2',
          600: '#417ec6',
          700: '#386dab',
          800: '#2f5c90',
          900: '#264a75',
          950: '#224267',
          DEFAULT: '#4A90E2',
        },
        accent: {
          50: '#f4f4f4',
          100: '#eaeaea',
          200: '#d6d6d6',
          300: '#c1c1c1',
          400: '#adadad',
          500: '#333333',
          600: '#2c2c2c',
          700: '#262626',
          800: '#202020',
          900: '#1a1a1a',
          950: '#171717',
          DEFAULT: '#333333',
        },
        surface: {
          50: '#FFFFFF',
          100: '#F9F9F9',
          200: '#F3F4F6',
          300: '#E5E7EB',
          400: '#D1D5DB',
        },
        content: {
          DEFAULT: '#1A1A1A',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
      },
    },
  },
}
