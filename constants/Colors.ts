// colors.ts
const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    subText: "#666",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    neuBackground: "#f0f0f0",
    neuTransparentBackground: "#ffffff00",
    neuShadowLight: "#ffffff",
    neuShadowDark: "#d1d9e6",

    // Add card-style overrides
    primaryColor: "#2f95dc",
    secondaryColor: "#f0f0f0",
    cardBackground: "#a3b1c6",
    cardBorder: "#F0F0F0",
    cardShadow: "#a3b1c6",
    cardBackgroundSemiTransparent: "rgba(211, 211, 211, 0.5)",
    cardBorderSemiTransparent: "rgba(233, 233, 233, 0.5)",
    cardShadowSemiTransparent: "rgba(163, 177, 198, 0.5)",
  },
  dark: {
    text: "#fff",
    subText: "#F0F0F0",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    neuBackground: "#111111",
    neuTransparentBackground: "#00000000",
    neuShadowLight: "#2a2a2a",
    neuShadowDark: "#000000",

    // Dark mode card style
    primaryColor: "#2f95dc",
    secondaryColor: "#4a4a4a",
    cardBackground: "#4a4a4a",
    cardBorder: "#5a5a5a",
    cardShadow: "#000000",
    cardBackgroundSemiTransparent: "rgba(74, 74, 74, 0.5)",
    cardBorderSemiTransparent: "rgba(90, 90, 90, 0.5)",
    cardShadowSemiTransparent: "rgba(0, 0, 0, 0.5)",
  },
};
