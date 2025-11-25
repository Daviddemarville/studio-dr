import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1C3D5A",
        accent: "#9CC5A1",
      },
    },
  },
  plugins: [],
};
export default config;
