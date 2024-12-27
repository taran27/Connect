import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'
import { useAuthStore } from '@/store/authStore'
import SpaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono,
    ...FontAwesome.font,
  })

  // Load the authentication state on app startup
  const loadAuthState = useAuthStore((state) => state.loadAuthState)

  useEffect(() => {
    loadAuthState() // Load the auth state from secure storage
  }, [])

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { agencyName } = useGlobalSearchParams()
  const agencyTitle = Array.isArray(agencyName)
    ? agencyName.join(', ')
    : agencyName

  // Redirect based on authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      router.push('/(tabs)')
    }
  }, [isAuthenticated])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
            headerShown: false, // Hide the header for a full-screen branded experience
          }}
        />

        {/* Tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor:
                colorScheme === 'dark'
                  ? DarkTheme.colors.background
                  : DefaultTheme.colors.background, // Set header background color
            },
            headerTintColor:
              colorScheme === 'dark'
                ? DarkTheme.colors.text
                : DefaultTheme.colors.text, // Set header text color
            headerTitleStyle: {
              fontWeight: 'bold', // Customize header title style
            },
            headerTitleAlign: 'left', // Align header title to the left
          }}
        />

        {/* Only include modal screens if not auto-generated */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: agencyTitle }}
        />
        <Stack.Screen
          name="detail-modal"
          options={{ presentation: 'modal', title: 'Appointments Details' }}
        />
        <Stack.Screen
          name="calander-modal"
          options={{ presentation: 'modal', title: 'Appointments' }}
        />
      </Stack>
    </ThemeProvider>
  )
}
