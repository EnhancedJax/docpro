/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4894FE",
        text: "#0D1B34",
        text10: "rgba(13, 27, 52, 0.12)",
        tgray: "#8696BB",
        gray: "#FAFAFA",
        softPrimary: "rgb(99,180,255)",
        softPrimary10: "rgba(99, 180, 255, 0.1)",
        danger: "rgb(255,99,99)",
        danger10: "rgba(255, 99, 99, 0.1)",
        success: "rgb(28,207,73)",
        success10: "rgba(28, 207, 73, 0.1)",
        payment: "rgb(255, 171, 76)",
        payment10: "rgba(255, 171, 76, 0.1)",
      },
    },
  },
  plugins: [],
};
