const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: {
    colors: {
      tomato: "#C2371F", oven: "#E57A1F", crust: v("crust"), char: v("char"), basil: "#3E6B3C",
      background: v("background"), foreground: v("foreground"),
      card: { DEFAULT: v("card"), foreground: v("card-foreground") },
      popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
      primary: { DEFAULT: v("primary"), foreground: v("primary-foreground") },
      secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
      muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
      accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
      destructive: { DEFAULT: v("destructive") },
      border: v("border"), input: v("input"), ring: v("ring"),
    },
    fontFamily: { display: ['"Bricolage Grotesque"', "Georgia", "serif"], sans: ['"Instrument Sans"', "system-ui", "sans-serif"] },
  } },
  plugins: [require("tailwindcss-animate")],
};