import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "background-light": "var(--background-light)",
        "background-dark": "var(--background-dark)",
        "surface-light": "var(--surface-light)",
        "surface-dark": "var(--surface-dark)",
        ytop: {
          red: "var(--ytop-red)",
          "red-hover": "var(--ytop-red-hover)",
          "red-light": "var(--ytop-red-light)",
          blue: "var(--ytop-blue)",
          "blue-hover": "var(--ytop-blue-hover)",
          "blue-light": "var(--ytop-blue-light)",
          "blue-dark": "var(--ytop-blue-dark)",
          "blue-darker": "var(--ytop-blue-darker)",
          yellow: "var(--ytop-yellow)",
          "yellow-light": "var(--ytop-yellow-light)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "ytop": "1rem",
        "ytop-lg": "1.5rem",
      },
      boxShadow: {
        "ytop": "0 4px 14px 0 rgb(29 78 216 / 12%), 0 2px 6px 0 rgb(239 68 68 / 08%)",
        "ytop-lg": "0 10px 40px -10px rgb(30 58 138 / 20%), 0 4px 12px -4px rgb(239 68 68 / 12%)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
