import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthState, TokenResponse } from '@/types/types'

export const useAuthStore = create<AuthState>((set) => ({
  // Authentication states
  isAuthenticated: false,
  userInfo: null,
  tokenData: null,

  // Biometric state
  isBiometricEnabled: false,

  /**
   * Set authentication state.
   * - Stores `tokenData` securely in SecureStore.
   * - Stores `userInfo` in AsyncStorage.
   */
  setAuthState: async (isAuthenticated, userInfo, tokenData) => {
    try {
      set({ isAuthenticated, userInfo, tokenData })

      // Store sensitive data (tokenData) in SecureStore
      if (tokenData) {
        await SecureStore.setItemAsync('tokenData', JSON.stringify(tokenData))
      }

      // Store non-sensitive data (userInfo) in AsyncStorage
      if (isAuthenticated && userInfo) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
      }
    } catch (error) {
      console.error('Failed to set authentication state:', error)
      throw error // Re-throw the error
    }
  },

  /**
   * Clear authentication state.
   * - Removes `tokenData` from SecureStore.
   * - Removes `userInfo` from AsyncStorage.
   * - Retains biometric credentials.
   */
  clearAuthState: async () => {
    try {
      // Remove sensitive data from SecureStore
      await SecureStore.deleteItemAsync('tokenData')

      // Remove non-sensitive data from AsyncStorage
      await AsyncStorage.removeItem('userInfo')

      set({
        isAuthenticated: false,
        userInfo: null,
        tokenData: null,
      })
    } catch (error) {
      console.error('Failed to clear authentication state:', error)
      throw error // Re-throw the error
    }
  },

  /**
   * Load authentication state from storage.
   * - Retrieves `tokenData` from SecureStore.
   * - Retrieves `userInfo` from AsyncStorage.
   * - Validates token expiration.
   * - Loads biometric state.
   */
  loadAuthState: async () => {
    try {
      // Load sensitive data from SecureStore
      const storedTokenData = await SecureStore.getItemAsync('tokenData')

      // Load non-sensitive data from AsyncStorage
      const storedUserInfo = await AsyncStorage.getItem('userInfo')

      // Load biometric state from SecureStore
      const storedBiometricState =
        await SecureStore.getItemAsync('isBiometricEnabled')

      let isAuthenticated = false

      if (storedTokenData && storedUserInfo) {
        const tokenData: TokenResponse = JSON.parse(storedTokenData)

        // Check if the token has expired
        const currentTime = Date.now()
        const tokenIssuedAt = parseInt(tokenData.issued_at, 10) * 1000 // Convert to milliseconds if necessary
        const tokenExpiryTime = tokenIssuedAt + 3600 * 1000 // Assuming 1 hour expiry

        if (currentTime < tokenExpiryTime) {
          isAuthenticated = true
          set({
            isAuthenticated,
            userInfo: JSON.parse(storedUserInfo),
            tokenData,
          })
        } else {
          // Token expired
          await SecureStore.deleteItemAsync('tokenData')
          await AsyncStorage.removeItem('userInfo')
          set({
            isAuthenticated: false,
            userInfo: null,
            tokenData: null,
          })
        }
      }

      // Load biometric state
      const isBiometricEnabled =
        storedBiometricState !== null ? JSON.parse(storedBiometricState) : false

      set({ isBiometricEnabled })
    } catch (error) {
      console.error('Failed to load authentication state:', error)
      set({
        isAuthenticated: false,
        userInfo: null,
        tokenData: null,
        isBiometricEnabled: false,
      })
      throw error // Re-throw the error
    }
  },

  /**
   * Toggle biometric authentication state and save credentials.
   * - If enabled, stores `biometricCredentials` in SecureStore.
   * - If disabled, removes `biometricCredentials` from SecureStore.
   * - Updates `isBiometricEnabled` flag in SecureStore.
   */
  setBiometricEnabled: async (
    enabled,
    username?: string,
    password?: string,
  ) => {
    try {
      if (enabled) {
        if (!username || !password) {
          throw new Error(
            'Username and password are required to enable biometrics.',
          )
        }
        // Store biometric credentials securely
        await SecureStore.setItemAsync(
          'biometricCredentials',
          JSON.stringify({ username, password }),
        )
      } else {
        // Clear biometric credentials
        await SecureStore.deleteItemAsync('biometricCredentials')
      }

      // Update biometric enabled state
      set({ isBiometricEnabled: enabled })

      // Store biometric enabled flag in SecureStore
      await SecureStore.setItemAsync(
        'isBiometricEnabled',
        JSON.stringify(enabled),
      )
    } catch (error) {
      console.error('Failed to set biometric state:', error)
      throw error // Re-throw the error
    }
  },

  /**
   * Retrieve stored credentials for biometric login.
   * - Fetches `biometricCredentials` from SecureStore.
   */
  getBiometricCredentials: async () => {
    try {
      const storedCredentials = await SecureStore.getItemAsync(
        'biometricCredentials',
      )

      if (!storedCredentials) {
        console.warn('No biometric credentials found.')
        return null
      }

      return JSON.parse(storedCredentials)
    } catch (error) {
      console.error('Failed to retrieve biometric credentials:', error)
      throw error // Re-throw the error
    }
  },

  /**
   * Load biometric state from storage.
   * - Retrieves `isBiometricEnabled` flag from SecureStore.
   */
  loadBiometricState: async () => {
    try {
      const storedBiometricState =
        await SecureStore.getItemAsync('isBiometricEnabled')
      const isBiometricEnabled =
        storedBiometricState !== null ? JSON.parse(storedBiometricState) : false
      set({ isBiometricEnabled })
    } catch (error) {
      console.error('Failed to load biometric state:', error)
      set({ isBiometricEnabled: false })
      throw error // Re-throw the error
    }
  },
}))
