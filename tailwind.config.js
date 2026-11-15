export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#06050F",
        ink: "#0E0C1F",
        violet: { DEFAULT: "#7B5CFF", soft: "#A18BFF" },
        cyan: { DEFAULT: "#2DE2E6" },
        pink: { DEFAULT: "#FF4F9A" },
        mist: "#A9A6CC",
      },
      fontFamily: {
        display: ["\"Unbounded Variable\"", "Unbounded", "sans-serif"],
        body: ["\"DM Sans Variable\"", "DM Sans", "sans-serif"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "marquee-rev": { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(8vw,-6vh) scale(1.2)" },
          "66%": { transform: "translate(-6vw,8vh) scale(0.9)" },
        },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-4px)" } },
        drift: {
          "0%": { transform: "translateY(18px)", opacity: "0" },
          "15%": { opacity: "var(--o, 0.55)" },
          "85%": { opacity: "var(--o, 0.55)" },
          "100%": { transform: "translateY(-46px)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-rev": "marquee-rev 46s linear infinite",
        aurora: "aurora 22s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 5s linear infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
        spinSlow: "spinSlow 18s linear infinite",
        bob: "bob 3.2s ease-in-out infinite",
        drift: "drift 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
