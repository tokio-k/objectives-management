module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        "reverse-spin": "reverse-spin 1s linear infinite",
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
      },
      colors: {
        themeGray: {
          1: "#d1d5db",
          2: "#9ca3af",
          3: "#4b5563",
          bg: "#111827",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
