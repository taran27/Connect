import { Alert } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { salesforceConfig } from '@/config/salesforceConfig'
import { TokenResponse, UserInfo } from '@/types/types'

/**
 * Custom hook for handling authentication logic.
 *
 * This hook provides a `login` function that:
 * - Authenticates the user with Salesforce.
 * - Stores authentication tokens securely.
 * - Optionally enables biometric authentication for future logins.
 */
export const useAuthHook = () => {
  const { setAuthState, isBiometricEnabled, setBiometricEnabled } =
    useAuthStore()

  /**
   * Logs in the user with the provided username and password.
   *
   * @param username - The user's Salesforce username.
   * @param password - The user's Salesforce password.
   * @returns The authenticated user's information.
   * @throws An error if authentication fails or if user information cannot be fetched.
   */
  const login = async (username: string, password: string) => {
    try {
      // Authenticate with Salesforce to obtain token data
      const response = await fetch(
        'https://login.salesforce.com/services/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: salesforceConfig.clientId,
            client_secret: salesforceConfig.clientSecret,
            username,
            password,
          }).toString(),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || 'Login failed')
      }

      const tokenData: TokenResponse = await response.json()

      // Fetch user information using the obtained token
      const userInfoResponse = await fetch(tokenData.id, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user information')
      }

      const userInfo: UserInfo = await userInfoResponse.json()

      // Update authentication state by storing token and user info
      await setAuthState(true, userInfo, tokenData)

      // Prompt the user to enable biometric authentication if not already enabled
      if (!isBiometricEnabled) {
        Alert.alert(
          'Enable Biometric Login?',
          'Would you like to enable login with Face ID or Fingerprint for faster access?',
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => {
                setBiometricEnabled(false)
              },
            },
            {
              text: 'Yes',
              onPress: () => {
                setBiometricEnabled(true, username, password)
              },
            },
          ],
        )
      }

      return userInfo
    } catch (error) {
      console.error('Login error:', error)
      throw error // Re-throw the error to be handled by the caller
    }
  }

  return { login }
}
