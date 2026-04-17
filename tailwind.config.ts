import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        orange: {
          500: '#f97316',
        },
        success: {
          500: '#22c55e',
        },
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
        },
        text: {
          DEFAULT: '#111827',
          secondary: '#6b7280',
        },
        border: '#e5e7eb',
      },
      fontFamily: {
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
