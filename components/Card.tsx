// Card.tsx
import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

type CardProps = Readonly<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  blurIntensity?: number;
}>;

export default function Card({
  children,
  style,
  blurIntensity = 75,
}: CardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colors[colorScheme];

  return (
    <BlurView
      tint={colorScheme === "dark" ? "dark" : "light"}
      intensity={blurIntensity}
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.cardBorder,
          shadowColor: theme.cardShadow,
        },
        style, // allow user to override or extend
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",

    // Shadow (typical range for shadowOpacity is 0.0-1.0, not 10)
    elevation: 12,
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.35, // adjust to taste
    shadowRadius: 8,

    // Border
    borderWidth: 2.5,
  },
});
