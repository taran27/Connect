import { StyleSheet, View, ImageBackground, Image } from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import launchImage from '@/assets/images/launch.png'
import logoImage from '@/assets/images/Logo.png'
import { LogoFooterProps } from '@/types/types'

const LogoFooter: React.FC<LogoFooterProps> = ({ addedStyles }) => {
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = Colors[colorScheme]

  return (
    <ImageBackground
      source={launchImage}
      style={[
        styles.background,
        {
          backgroundColor: themeColors.background,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      <View style={[styles.container, addedStyles]}>
        <Image source={logoImage} style={styles.logo} />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  logo: {
    resizeMode: 'contain',
    width: '70%',
    height: '120%',
  },
  background: {
    flex: 1,
    width: '100%',
    maxHeight: '25%',
    borderWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 4,
  },
})

export default LogoFooter
