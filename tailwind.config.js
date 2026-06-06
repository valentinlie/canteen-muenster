/** @type {import('tailwindcss').Config} */
const withOpacity = (varName) => `rgb(var(${varName}) / <alpha-value>)`;

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: withOpacity("--bg"),
        surface: {
          DEFAULT: withOpacity("--surface"),
          2: withOpacity("--surface-2"),
        },
        border: withOpacity("--border"),
        primary: {
          DEFAULT: withOpacity("--primary"),
          press: withOpacity("--primary-press"),
        },
        "on-primary": withOpacity("--on-primary"),
        accent: {
          DEFAULT: withOpacity("--accent"),
          on: withOpacity("--on-accent"),
        },
        header: {
          DEFAULT: withOpacity("--header"),
          on: withOpacity("--on-header"),
          muted: withOpacity("--on-header-muted"),
        },
        ink: {
          DEFAULT: withOpacity("--text"),
          muted: withOpacity("--text-muted"),
          faint: withOpacity("--text-faint"),
        },
      },
    },
  },
  plugins: [],
};
