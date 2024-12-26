import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";

export const useLogout = () => {
  const setAuthState = useAuthStore((state) => state.setAuthState);
  const clearAuthState = useAuthStore((state) => state.clearAuthState);
  const router = useRouter();

  const logout = async () => {
    try {
      // Clear only authentication-specific state but retain biometric credentials
      await setAuthState(false, null, null);

      // Clear the authentication state
      await clearAuthState();

      // Navigate to the login screen
      router.replace("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return { logout };
};
