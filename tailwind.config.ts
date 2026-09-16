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
        // Verde institucional Ingenio La Unión: tono sólido, sin degradados,
        // usado con intención en marca, navegación y acciones primarias.
        union: {
          50: '#f1f6f3',
          100: '#dfeae4',
          200: '#bfd6c8',
          300: '#93b9a3',
          400: '#63977a',
          500: '#437a5c',
          600: '#33604a',
          700: '#294d3c',
          800: '#1f3c2f',
          900: '#183024',
          950: '#0c1a15',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        // Sombras de una sola capa y bajo contraste: la jerarquía la marca
        // el borde y el color, no un halo difuso tipo "glow".
        card: '0 1px 2px rgba(15,23,20,0.06)',
        'card-hover': '0 2px 8px rgba(15,23,20,0.08)',
        panel: '0 4px 16px rgba(15,23,20,0.10)',
      },
      borderRadius: {
        // Escala contenida para una consola operativa: nada de esquinas
        // exageradas. Esto retabula rounded-2xl/3xl en todo el proyecto
        // sin tener que tocar cada className.
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '10px',
        '3xl': '12px',
      },
    },
  },
  plugins: [],
};
export default config;
