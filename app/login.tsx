import React, { useState, useEffect } from 'react'
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native'
import { Text, View } from '@/components/Themed'
import { useColorScheme } from '@/components/useColorScheme'
import colors from '@/constants/Colors'
import LogoFooter from '@/components/LogoFooter'
import { useAuthHook } from '@/hooks/useAuth'
import { BlurView } from 'expo-blur'
import * as LocalAuthentication from 'expo-local-authentication'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/store/authStore'
import faceId from '@/assets/images/face-id.png'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [biometricType, setBiometricType] = useState<string | null>(null)
  const { login } = useAuthHook()
  const { isBiometricEnabled, getBiometricCredentials } = useAuthStore()
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = colors[colorScheme]

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (hasHardware) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync()
        if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType(Platform.OS === 'android' ? 'fingerprint' : 'faceid')
        } else if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
          )
        ) {
          setBiometricType('faceid')
        }
      }
    }

    checkBiometricSupport()
  }, [])

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Login Failed', 'Username and password are required.')
      return
    }

    try {
      await login(username, password)
    } catch (error: any) {
      Alert.alert('Login Failed', error.message)
    }
  }

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Biometrics',
      })

      if (result.success) {
        const credentials = await getBiometricCredentials()
        if (credentials) {
          const { username, password } = credentials
          await login(username, password) // Auto-login with saved credentials
        } else {
          Alert.alert(
            'Biometric Error',
            'Stored credentials not found. Please log in manually.',
          )
        }
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication failed.')
      }
    } catch (error) {
      console.error(error)
      Alert.alert(
        'Authentication Error',
        'An error occurred during biometric authentication.',
      )
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LogoFooter />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BlurView intensity={80} tint="light" style={styles.blurContainer}>
          <View style={styles.neumorphicContainer}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              Agent Portal : Version 1.0.0
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.subText }]}>
              Powered by Salesforce
            </Text>

            {/* Input Fields */}
            <View
              style={[
                styles.inputContainer,
                { borderColor: themeColors.cardBorder },
              ]}
            >
              <TextInput
                style={[styles.inputField, { color: themeColors.text }]}
                placeholder="Username"
                placeholderTextColor={themeColors.subText}
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                { borderColor: themeColors.cardBorder },
              ]}
            >
              <TextInput
                style={[styles.inputField, { color: themeColors.text }]}
                placeholder="Password"
                placeholderTextColor={themeColors.subText}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={handlePasswordVisibility}
                style={styles.visibilityToggle}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color={themeColors.subText}
                />
              </TouchableOpacity>
            </View>

            {/* Buttons Row */}
            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: themeColors.primaryColor },
                ]}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              {biometricType && isBiometricEnabled && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleBiometricAuth}
                >
                  {biometricType === 'faceid' ? (
                    <Image
                      source={faceId}
                      style={[
                        styles.iconImage,
                        {
                          tintColor: themeColors.primaryColor,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name="finger-print-outline"
                      size={30}
                      color={themeColors.primaryColor}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  neumorphicContainer: {
    width: '92%',
    borderRadius: 20,
    paddingHorizontal: 20,
    elevation: 12,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 10,
    shadowRadius: 8,
    borderColor: '#e9e9e9',
    borderWidth: 2.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'small-caps',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputField: {
    flex: 1,
    padding: 15,
  },
  visibilityToggle: {
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    borderRadius: 10,
    borderColor: '#A6C8FF',
    borderWidth: 2,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    shadowOpacity: 0.3,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
