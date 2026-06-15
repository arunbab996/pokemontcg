/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D12',
        surface: '#16161F',
        border: '#2A2A3A',
        accent: '#E53E3E',
        'accent-2': '#F6C90E',
        'text-1': '#F0F0F5',
        'text-2': '#7070A0',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

