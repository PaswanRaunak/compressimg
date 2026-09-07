/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Desaturated mint-teal accent — one accent for the whole dark interface.
        accent: {
          50: '#eff9f6',
          100: '#d7f0e8',
          200: '#b0e1d3',
          300: '#84cdb9',
          400: '#5cb49e',
          500: '#439a86',
          600: '#377d6e',
          700: '#2f6459',
          800: '#28514a',
          900: '#22433e',
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        // On dark, depth comes from near-black falloff plus hairlines, not gray shadows.
        soft: '0 0 0 1px rgba(255,255,255,0.03), 0 16px 40px -20px rgba(0,0,0,0.7)',
        lift: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px -24px rgba(0,0,0,0.8)',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
}
