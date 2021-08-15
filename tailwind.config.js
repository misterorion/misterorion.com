module.exports = {
  purge: ['./src/**/*.js'],
  theme: {
    screens: {
      mobile: '360px',
      tablet: '768px',
      desktop: '1024px',
    },
    container: {
      center: true,
    },
    extend: {
      zIndex: {
        'n1': '-10',
      },
      colors: {
        gray: {
          100: '#fafafa',
          400: '#d8dee9',
          600: '#4c566a',
          900: '#2e3440',
        },
        teal: {
          700: '#0F766E',
        },
      },
    },
  },
  variants: {
    extend: {
      outline: ['focus'],
    },
  },
  plugins: [],
}
