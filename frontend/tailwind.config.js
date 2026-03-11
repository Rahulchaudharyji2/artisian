/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'karigar-bg': '#FFF7F2',
        'karigar-primary': '#C65D3B',
        'karigar-accent': '#E9A178',
        'qala-gold': '#D4AF37',
        'qala-terracotta': '#E2725B',
        'qala-indigo': '#4B0082',
        'qala-saffron': '#FF9933',
        'qala-earth': '#7B3F00',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
