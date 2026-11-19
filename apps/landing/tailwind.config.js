/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mb: {
          navy: 'var(--mb-brand-navy)',
          primary: 'var(--mb-brand-primary)',
          violet: 'var(--mb-brand-violet)',
          pink: 'var(--mb-brand-pink)',
          canvas: 'var(--mb-bg)',
          surface: 'var(--mb-surface)',
          soft: 'var(--mb-surface-soft)',
          text: 'var(--mb-text)',
          muted: 'var(--mb-text-secondary)',
          border: 'var(--mb-border)',
          success: 'var(--mb-success)'
        }
      },
      fontFamily: {
        sans: ['var(--mb-font-sans)', 'Plus Jakarta Sans', 'Arial', 'sans-serif']
      },
      boxShadow: {
        card: '0 12px 32px -4px rgba(27, 27, 98, 0.08)',
        floating: '0 18px 40px -6px rgba(93, 98, 234, 0.18)',
        cta: '0 10px 25px -4px rgba(109, 40, 217, 0.45)'
      },
      borderRadius: {
        card: '24px',
        xl2: '32px'
      }
    }
  },
  plugins: []
};
