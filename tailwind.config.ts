import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        union: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,30,20,0.05), 0 1px 1px rgba(20,30,20,0.04)',
        'card-hover': '0 2px 4px rgba(20,30,20,0.04), 0 8px 20px rgba(20,30,20,0.08)',
        panel: '0 4px 8px rgba(20,30,20,0.05), 0 20px 40px rgba(20,30,20,0.10)',
      },
    },
  },
  plugins: [],
};
export default config;
