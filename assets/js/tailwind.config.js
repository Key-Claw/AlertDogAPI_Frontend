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
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
          950: '#4C1D95',
          DEFAULT: '#A855F7',
        },
        accent: {
          50: '#F6F0FF',
          100: '#EFE7FF',
          200: '#E6D8FF',
          300: '#D6C2FF',
          400: '#B892FF',
          500: '#3B165C', /* texto/acentos oscuros en morado */
          600: '#33144F',
          700: '#2B1142',
          800: '#241035',
          900: '#1D0D28',
          950: '#170A1F',
          DEFAULT: '#3B165C',
        },
        surface: {
          50: '#FFFFFF',
          100: '#FBF8FF', /* acorde al fondo lila muy suave */
          200: '#F3F0FA',
          300: '#E9E3F7',
          400: '#E0D8F3',
        },
        content: {
          DEFAULT: '#2C1440', /* color principal del texto (oscuro morado) */
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
      },
    },
  },
}