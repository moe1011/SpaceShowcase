/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "rainbow-ring": {
          "0%": { boxShadow: "0 0 8px 2px red" },
          "20%": { boxShadow: "0 0 8px 2px orange" },
          "40%": { boxShadow: "0 0 8px 2px yellow" },
          "60%": { boxShadow: "0 0 8px 2px lime" },
          "80%": { boxShadow: "0 0 8px 2px pink" },
          "100%": { boxShadow: "0 0 8px 2px violet" },
        },
        "talk": {
          "0%": {
            transform: "scaleX(-1) translateY(0)",
          },
          "100%": {
            transform: "scaleX(-1) translateY(-8px)",
          },
        },
      },
      animation: {
        "rainbow-ring": "rainbow-ring 5s linear infinite alternate",
        "talk": 'talk 0.3s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
