import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
      },
      /**
       * Georgia entra antes do Palatino: tem peso e olho maiores, o que mantém
       * a leitura confortável em telas de projeção sem perder o ar editorial.
       */
      fontFamily: {
        display: ["Georgia", '"Palatino Linotype"', "Palatino", '"Times New Roman"', "serif"],
        sans: ['"Segoe UI"', "Inter", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,34,56,.04), 0 12px 32px -24px rgba(21,34,56,.45)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
    logs: false,
  },
};

export default config;