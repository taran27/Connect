import React from "react";
import { StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/store/authStore";
import Card from "@/components/Card";
import { Ionicons } from "@expo/vector-icons";

const ProfileTab = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const isBiometricEnabled = useAuthStore((state) => state.isBiometricEnabled);
  const setBiometricEnabled = useAuthStore(
    (state) => state.setBiometricEnabled
  );
  const clearAuthState = useAuthStore((state) => state.clearAuthState);

  const handleDisableBiometric = async () => {
    Alert.alert(
      "Disable Biometrics",
      "Are you sure you want to disable biometric login?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            await setBiometricEnabled(false);
            Alert.alert("Success", "Biometric login has been disabled.");
          },
        },
      ]
    );
  };

  const handleClearData = async () => {
    Alert.alert(
      "Clear Data",
      "This will log you out and clear all stored data. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            await clearAuthState();
            Alert.alert("Success", "All data has been cleared.");
          },
        },
      ]
    );
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Profile Data Available</Text>
      </View>
    );
  }

  const {
    first_name = "N/A",
    last_name = "N/A",
    email = "N/A",
    mobile_phone,
    // photos,
    addr_city,
    addr_state,
    addr_country,
    active,
    email_verified,
    nick_name,
    timezone,
    user_type,
  } = userInfo;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Card */}
      <Card style={styles.profileCard}>
        {/* Profile Picture */}
        {/* {photos?.picture ? (
          <Image source={{ uri: photos.picture }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )} */}

        {/* Name and Email */}
        <Text style={styles.name}>
          {first_name} {last_name}
        </Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={[styles.status, { color: active ? "green" : "red" }]}>
          Status: {active ? "Active" : "Inactive"}
        </Text>
      </Card>

      {/* Detailed Information Section */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Personal Details</Text>
        <Text style={styles.info}>Nickname: {nick_name || "N/A"}</Text>
        <Text style={styles.info}>User Type: {user_type || "N/A"}</Text>
        <Text style={styles.info}>Timezone: {timezone || "N/A"}</Text>

        <Text style={styles.infoTitle}>Contact</Text>
        <Text style={styles.info}>
          📱 Mobile Phone: {mobile_phone || "No phone number available"}
        </Text>

        <Text style={styles.infoTitle}>Address</Text>
        <Text style={styles.info}>
          🏠{" "}
          {addr_city || addr_state || addr_country
            ? `${addr_city || ""}, ${addr_state || ""}, ${addr_country || ""}`
            : "No address available"}
        </Text>

        <Text style={styles.infoTitle}>Account</Text>
        <Text style={styles.info}>
          Email Verified: {email_verified ? "Yes" : "No"}
        </Text>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.actionCard}>
        <Text style={styles.infoTitle}>Actions</Text>

        {/* Disable Biometric */}
        {isBiometricEnabled && (
          <TouchableOpacity
            style={[styles.actionButton, styles.disableButton]}
            onPress={handleDisableBiometric}
          >
            <Ionicons name="finger-print" size={24} color="white" />
            <Text style={styles.actionButtonText}>Disable Biometrics</Text>
          </TouchableOpacity>
        )}

        {/* Clear Data */}
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClearData}
        >
          <Ionicons name="trash" size={24} />
          <Text style={styles.actionButtonText}>Clear Data and Logout</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  profileCard: {
    width: "100%",
    alignItems: "center",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#ddd",
  },
  placeholderText: {
    fontSize: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "bold",
  },
  infoCard: {
    width: "100%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionCard: {
    width: "100%",
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  actionButton: {
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disableButton: {
    backgroundColor: "#ff4c4c",
  },
  clearButton: {
    backgroundColor: "#ff7f50",
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProfileTab;
