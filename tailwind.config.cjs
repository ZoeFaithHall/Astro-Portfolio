module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        scroller3: {
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        "spin-reverse": {
          to: {
            transform: "rotate(-360deg)",
          },
        },
      },
      colors: {
        black: "#191919",
        white: "#F5F5F5",
        eagle: "#E7E2DA",
      },
    },
  },
  variants: {},
  plugins: [],
};
