/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@metronome/uim/tailwind.config")],
  content: ["./app/**/*.{ts,tsx}", "../../packages/uim/src/**/*.{ts,tsx}"],
}
