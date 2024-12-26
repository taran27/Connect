import { Alert } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { salesforceConfig } from "@/config/salesforceConfig";

export const useAuthHook = () => {
  const { setAuthState, isBiometricEnabled, setBiometricEnabled } =
    useAuthStore();

  const login = async (username: string, password: string) => {
    const response = await fetch(
      "https://login.salesforce.com/services/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          client_id: salesforceConfig.clientId,
          client_secret: salesforceConfig.clientSecret,
          username,
          password,
        }).toString(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || "Login failed");
    }

    const tokenData = await response.json();

    const userInfoResponse = await fetch(tokenData.id, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user information");
    }

    const userInfo = await userInfoResponse.json();

    setAuthState(true, userInfo, tokenData);

    // Check if biometric authentication is not enabled
    if (!isBiometricEnabled) {
      Alert.alert(
        "Enable Biometric Login?",
        "Would you like to enable login with Face ID or Fingerprint for faster access?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => {
              setBiometricEnabled(false);
            },
          },
          {
            text: "Yes",
            onPress: () => {
              setBiometricEnabled(true, username, password);
            },
          },
        ]
      );
    }

    return userInfo;
  };

  return { login };
};
