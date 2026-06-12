/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'gj-background':   'var(--gj-background)',
        'gj-surface':      'var(--gj-surface)',
        'gj-sidebar':      'var(--gj-sidebar)',
        'gj-text':         'var(--gj-text)',
        'gj-muted':        'var(--gj-muted)',
        'gj-accent':       'var(--gj-accent)',
        'gj-accent-hover': 'var(--gj-accent-hover)',
        'gj-accent-text':  'var(--gj-accent-text)',
        'gj-border':       'var(--gj-border)',
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'sans-serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
