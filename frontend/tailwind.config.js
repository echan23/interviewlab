/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // enables class-based dark mode (e.g. <html class="dark">)
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        // optional custom theme extensions
        borderRadius: {
          'lg': '0.5rem',
          'xl': '0.75rem',
        },
        colors: {
          background: 'var(--color-background)',
          foreground: 'var(--color-foreground)',
          primary: 'var(--color-primary)',
          'primary-foreground': 'var(--color-primary-foreground)',
          // Add others as needed...
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },
        animation: {
          fadeIn: 'fadeIn 0.5s ease-in-out',
        },
      },
    },
    plugins: [],
  }
  