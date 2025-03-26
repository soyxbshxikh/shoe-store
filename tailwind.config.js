/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          hover: '#333333',
        },
      },
      screens: {
        'xs': '480px',    // Small smartphones
        'sm': '640px',    // Larger smartphones
        'md': '768px',    // Tablets
        'lg': '1024px',   // Small laptops
        'xl': '1280px',   // Laptops and desktops
        '2xl': '1536px',  // Large desktop screens
      },
    },
  },
  plugins: [],
} 