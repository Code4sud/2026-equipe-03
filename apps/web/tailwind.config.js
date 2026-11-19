/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: 'var(--mb-brand-navy)',
          primary: 'var(--mb-brand-primary)',
          violet: 'var(--mb-brand-violet)',
          pink: 'var(--mb-brand-pink)'
        },
        surface: {
          canvas: 'var(--mb-bg)',
          card: 'var(--mb-surface)',
          soft: 'var(--mb-surface-soft)'
        },
        content: {
          primary: 'var(--mb-text)',
          secondary: 'var(--mb-text-secondary)'
        },
        border: {
          default: 'var(--mb-border)'
        }
      },
      fontFamily: {
        sans: ['var(--mb-font-sans)']
      },
      borderRadius: {
        sm: 'var(--mb-radius-sm)',
        md: 'var(--mb-radius-md)',
        lg: 'var(--mb-radius-lg)',
        xl: 'var(--mb-radius-xl)'
      },
      boxShadow: {
        card: 'var(--mb-shadow-card)'
      }
    }
  },
  plugins: []
};
