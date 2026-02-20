module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 🌟 Brand Core
        primary: {
          DEFAULT: '#fad3b4', // peach
          light: '#f9d2b2',
          dark: '#f8b98e',
        },
        secondary: {
          DEFAULT: '#a8ced1', // teal
          light: '#b9d9dc',
          dark: '#97c0c3',
        },

        // 🎨 Neutrals
        background: {
          DEFAULT: '#f4f0ec', // off-white
          light: '#ffffff',
          dark: '#efe9e5',
        },
        surface: '#ffffff',

        // 📝 Text
        text: {
          primary: '#2d2d2d',
          secondary: '#555555',
          muted: '#7a7a7a',
        },

        // ⚡️ States
        success: '#82c49d',
        warning: '#f9c97b',
        error: '#e27b7b',
        info: '#8fc6d3',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
