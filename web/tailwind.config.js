/** FAITH's look follows the family-organizer style of OpenFamily (warm paper,
 *  editorial serif headings, hairline cards, a pill tab bar) with its own palette.
 *  @type {import('tailwindcss').Config} */
const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: c("background"), foreground: c("foreground"), surface: c("surface"), "surface-2": c("surface-2"),
        border: c("border"), "border-strong": c("border-strong"), muted: c("muted"),
        primary: { DEFAULT: c("primary"), foreground: c("primary-foreground"), soft: c("primary-soft"), hover: c("primary-hover") },
        success: c("success"), warning: c("warning"), danger: c("danger"),
      },
      fontFamily: {
        sans: ['"Instrument Sans Variable"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ['"Fraunces Variable"', "Georgia", "Cambria", "serif"],
      },
      borderRadius: { card: "18px", input: "12px" },
      boxShadow: { surface: "var(--shadow-surface)", lift: "var(--shadow-lift)" },
      keyframes: { pulse2: { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.08)", opacity: 0.85 } } },
      animation: { pulse2: "pulse2 1.4s ease-in-out infinite" },
    },
  },
  plugins: [],
};
