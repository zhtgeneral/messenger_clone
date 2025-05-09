import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./test/.storybook/preview.tsx",
  ],
  theme: {
    extend: {},
    screens: {
      'xxs': '220px',
      'xs': '400px',
      'xxl': '1440px',
      'xxxl': '2160px',
      'xxxxl': '4320px',
      ...defaultTheme.screens
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ],
};
export default config;
