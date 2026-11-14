/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4C6EF5',
        'primary-dark': '#3B5BDB',
        'primary-light': '#EEF2FF',
        'danger-light': '#FFF1F0',
      },
    },
  },
  plugins: [],
};
