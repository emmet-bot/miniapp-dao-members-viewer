import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#f8fafb',
          100: '#f5f8fa',
          200: '#eef3f6',
          300: '#dee7ed',
          400: '#bdcedb',
          500: '#9cb6c9',
          600: '#7a9db8',
          700: '#476a85',
          750: '#365063',
          800: '#1b2832',
          850: '#243542',
          900: '#121b21',
          950: '#0d1419',
        },
        'lukso-pink': '#FE005B',
        'lukso-magenta': '#D4004C',
      },
    },
  },
  plugins: [],
} satisfies Config
