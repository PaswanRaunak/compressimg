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
        // Single deep-green accent, calibrated for a warm paper-light interface.
        accent: {
          50: '#f0f6f2',
          100: '#dcebe2',
          200: '#bcd7c8',
          300: '#93bda7',
          400: '#679f83',
          500: '#4a8268',
          600: '#386853',
          700: '#2e5443',
          800: '#284538',
          900: '#223a30',
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        // Light theme: soft warm falloff, never gray-black.
        soft: '0 1px 2px rgba(28,25,23,0.04), 0 12px 32px -16px rgba(28,25,23,0.14)',
        lift: '0 2px 4px rgba(28,25,23,0.05), 0 24px 48px -20px rgba(28,25,23,0.2)',
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
    },
  },
  plugins: [],
}
