import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

// Define interfaces for user information and token response
interface UserPhotos {
  picture: string;
  thumbnail: string;
}

interface UserStatus {
  body: string | null;
  created_date: string | null;
}

interface UserUrls {
  custom_domain: string;
  enterprise: string;
  feed_elements: string;
  feed_items: string;
  feeds: string;
  groups: string;
  metadata: string;
  partner: string;
  profile: string;
  query: string;
  recent: string;
  rest: string;
  search: string;
  sobjects: string;
  tooling_rest: string;
  tooling_soap: string;
  users: string;
}

interface UserInfo {
  active: boolean;
  addr_city: string | null;
  addr_country: string | null;
  addr_state: string | null;
  addr_street: string | null;
  addr_zip: string | null;
  asserted_user: boolean;
  display_name: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  id: string;
  is_app_installed: boolean;
  is_lightning_login_user: boolean;
  language: string;
  last_modified_date: string;
  last_name: string;
  locale: string;
  mobile_phone: string | null;
  mobile_phone_verified: boolean;
  nick_name: string;
  organization_id: string;
  photos: UserPhotos;
  status: UserStatus;
  timezone: string;
  urls: UserUrls;
  user_id: string;
  user_type: string;
  username: string;
  utcOffset: number;
}

interface TokenResponse {
  access_token: string;
  id: string;
  instance_url: string;
  issued_at: string;
  signature: string;
  token_type: string;
}

// Extend AuthState to include token data and biometric state
interface AuthState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  tokenData: TokenResponse | null;
  setAuthState: (
    isAuthenticated: boolean,
    userInfo: UserInfo | null,
    tokenData: TokenResponse | null
  ) => void;
  clearAuthState: () => void;
  loadAuthState: () => Promise<void>;
  isBiometricEnabled: boolean;
  setBiometricEnabled: (
    enabled: boolean,
    username?: string,
    password?: string
  ) => void;
  loadBiometricState: () => Promise<void>;
  getBiometricCredentials: () => Promise<{
    username: string;
    password: string;
  } | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Authentication states
  isAuthenticated: false,
  userInfo: null,
  tokenData: null,

  // Biometric state
  isBiometricEnabled: false,

  // Set authentication state
  setAuthState: async (isAuthenticated, userInfo, tokenData) => {
    try {
      set({ isAuthenticated, userInfo, tokenData });

      if (userInfo) {
        await SecureStore.setItemAsync("userInfo", JSON.stringify(userInfo));
      }
      if (tokenData) {
        await SecureStore.setItemAsync("tokenData", JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error("Failed to set authentication state:", error);
    }
  },

  // Clear authentication state but retain biometric credentials
  clearAuthState: async () => {
    try {
      // Remove user info and token data but retain biometric credentials
      await SecureStore.deleteItemAsync("userInfo");
      await SecureStore.deleteItemAsync("tokenData");

      set({
        isAuthenticated: false,
        userInfo: null,
        tokenData: null,
      });
    } catch (error) {
      console.error("Failed to clear authentication state:", error);
    }
  },

  // Load authentication state from storage with token and biometric validation
  loadAuthState: async () => {
    try {
      const storedUserInfo = await SecureStore.getItemAsync("userInfo");
      const storedTokenData = await SecureStore.getItemAsync("tokenData");
      const storedBiometricState = await SecureStore.getItemAsync(
        "isBiometricEnabled"
      );

      let isAuthenticated = false;

      if (storedUserInfo && storedTokenData) {
        const tokenData = JSON.parse(storedTokenData);

        // Check if the token has expired
        const currentTime = Date.now();
        const tokenExpiryTime = parseInt(tokenData.issued_at, 10) + 3600 * 1000; // Assuming 1 hour expiry

        if (currentTime < tokenExpiryTime) {
          isAuthenticated = true;
          set({
            isAuthenticated,
            userInfo: JSON.parse(storedUserInfo),
            tokenData,
          });
        } else {
          // Token expired
          await SecureStore.deleteItemAsync("userInfo");
          await SecureStore.deleteItemAsync("tokenData");
          set({
            isAuthenticated: false,
            userInfo: null,
            tokenData: null,
          });
        }
      }

      // Load biometric state
      const isBiometricEnabled =
        storedBiometricState !== null
          ? JSON.parse(storedBiometricState)
          : false;

      set({ isBiometricEnabled });
    } catch (error) {
      console.error("Failed to load authentication state:", error);
      set({
        isAuthenticated: false,
        userInfo: null,
        tokenData: null,
        isBiometricEnabled: false,
      });
    }
  },

  // Toggle biometric authentication state and save credentials
  setBiometricEnabled: async (
    enabled,
    username?: string,
    password?: string
  ) => {
    try {
      if (enabled) {
        if (!username || !password) {
          throw new Error(
            "Username and password are required to enable biometrics."
          );
        }
        // Encrypt or securely store credentials
        await SecureStore.setItemAsync(
          "biometricCredentials",
          JSON.stringify({ username, password })
        );
      } else {
        await SecureStore.deleteItemAsync("biometricCredentials"); // Clear credentials
      }

      set({ isBiometricEnabled: enabled });
      await SecureStore.setItemAsync(
        "isBiometricEnabled",
        JSON.stringify(enabled)
      );
    } catch (error) {
      console.error("Failed to set biometric state:", error);
    }
  },

  // Retrieve stored credentials for biometric login
  getBiometricCredentials: async () => {
    try {
      const storedCredentials = await SecureStore.getItemAsync(
        "biometricCredentials"
      );

      if (!storedCredentials) {
        console.warn("No biometric credentials found.");
        return null;
      }

      return JSON.parse(storedCredentials);
    } catch (error) {
      console.error("Failed to retrieve biometric credentials:", error);
      return null;
    }
  },

  // Load biometric state from storage
  loadBiometricState: async () => {
    try {
      const storedBiometricState = await SecureStore.getItemAsync(
        "isBiometricEnabled"
      );
      const isBiometricEnabled =
        storedBiometricState !== null
          ? JSON.parse(storedBiometricState)
          : false;
      set({ isBiometricEnabled });
    } catch (error) {
      console.error("Failed to load biometric state:", error);
      set({ isBiometricEnabled: false });
    }
  },
}));
