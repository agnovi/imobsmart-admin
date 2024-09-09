const defaultTheme = require('tailwindcss/defaultTheme')
import palette from './palette.js'

module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
        fontWeight: {
          300: 300,
          400: 400,
          500: 500,
          600: 600,
          700: 700,
          800: 800
        },
        fontSize: {
          xs: '0.65rem'
        },
        colors: palette
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
