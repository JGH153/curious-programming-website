// https://colorhunt.co/palette/1f1d363f3351864879e9a6a6
// https://colorhunt.co/palette/1b262c0f4c753282b8bbe1fa
// https://colorhunt.co/palette/2d132c801336c72c41ee4540
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-dark": "rgb(31, 29, 54)",
        "background-dark": "rgb(31, 32, 40)",
        "secondary-dark": "rgb(63, 51, 81)",
        "accent-dark": "rgb(63, 51, 81)",
        "contrast-dark": "rgb(233, 166, 166)",
        "chat-dark": "#3E4042",
        "chat-blue": "#0084FF",
        "active-orange": "#d78e28",
      },
      scale: {
        300: "3.00",
      },
    },
  },
  plugins: [],
};
