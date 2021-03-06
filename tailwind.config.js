module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#93F393',
        secondary: '#60C2FF',
        accents: '#FFA04D',
      },
      boxShadow: {
        top: '0 -5px 25px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
