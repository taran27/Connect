import React from "react";
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  ImageBackground,
  Image,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

type Props = {
  addedStyles?: StyleProp<ViewStyle>;
};

const LogoFooter: React.FC<Props> = ({ addedStyles }) => {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <ImageBackground
      source={require("../assets/images/launch.png")}
      style={[
        styles.background,
        {
          backgroundColor: themeColors.background,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      <View style={[styles.container, addedStyles]}>
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logo}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  logo: {
    resizeMode: "contain",
    width: "70%",
    height: "120%",
  },
  background: {
    flex: 1,
    width: "100%",
    maxHeight: "25%",
    borderWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 4,
  },
});

export default LogoFooter;
