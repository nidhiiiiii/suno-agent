/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'md-bg': '#FFFBFE',
        'md-surface': '#F3EDF7',
        'md-surface-low': '#E7E0EC',
        'md-primary': '#6750A4',
        'md-secondary': '#E8DEF8',
        'md-tertiary': '#7D5260',
        'md-border': '#79747E',
        'md-on-surface': '#1C1B1F',
        'md-on-primary': '#FFFFFF',
      },
      borderRadius: {
        'md-sm': '8px',
        'md': '12px',
        'md-lg': '24px',
        'md-xl': '28px',
        'md-2xl': '32px',
        'md-3xl': '48px',
      },
      fontFamily: {
        'sans': ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
