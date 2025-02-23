/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    boxShadow: {
      'soft': '0 8px 32px rgba(0,0,0,0.05)',
    },
    spacing: {
      '128': '32rem',
    },
    borderRadius: {
      'xl': '1rem',
    }
  },
};
export const plugins = [];

