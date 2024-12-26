import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import colors from "@/constants/Colors";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useAgencies } from "@/hooks/useAgencies";

import Card from "@/components/Card";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ModalSelector from "react-native-modal-selector";

interface Broker {
  id: string;
  name: string;
  location: string;
  status: "Active" | "Pending";
  phone: string;
  opportunities: number;
  tasks: string[];
}

interface DialpadCall {
  id: string;
  brokerName: string;
  duration: number;
  status: "Completed" | "Missed";
  sentiment: number;
}

interface Insights {
  totalBrokers: number;
  activeBrokers: number;
  pendingBrokers: number;
  totalAppointments: number;
  callsMadeToday: number;
  missedCalls: number;
}

export default function TabOneScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = colors[colorScheme];

  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [callLogs, setCallLogs] = useState<DialpadCall[]>([]);
  const { agencies, loading: isAgencyLoading } = useAgencies();
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [insights, setInsights] = useState<Insights>({
    totalBrokers: 0,
    activeBrokers: 0,
    pendingBrokers: 0,
    totalAppointments: 10,
    callsMadeToday: 15,
    missedCalls: 3,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const brokerData: Broker[] = [
        {
          id: "1",
          name: "John Smith",
          location: "San Francisco, CA",
          status: "Active",
          phone: "123-456-7890",
          opportunities: 5,
          tasks: ["Follow up on policy update", "Send quote for renewal"],
        },
        {
          id: "2",
          name: "Sarah Johnson",
          location: "Los Angeles, CA",
          status: "Pending",
          phone: "987-654-3210",
          opportunities: 3,
          tasks: ["Schedule meeting", "Review submitted documents"],
        },
        {
          id: "3",
          name: "David Lee",
          location: "New York, NY",
          status: "Active",
          phone: "555-555-5555",
          opportunities: 8,
          tasks: ["Discuss partnership terms", "Send welcome package"],
        },
      ];

      const callData: DialpadCall[] = [
        {
          id: "1",
          brokerName: "John Smith",
          duration: 10,
          status: "Completed",
          sentiment: 4.5,
        },
        {
          id: "2",
          brokerName: "Sarah Johnson",
          duration: 5,
          status: "Missed",
          sentiment: 0,
        },
        {
          id: "3",
          brokerName: "David Lee",
          duration: 15,
          status: "Completed",
          sentiment: 4.8,
        },
      ];

      setTimeout(() => {
        setBrokers(brokerData);
        setCallLogs(callData);
        setInsights({
          totalBrokers: brokerData.length,
          activeBrokers: brokerData.filter(
            (broker) => broker.status === "Active"
          ).length,
          pendingBrokers: brokerData.filter(
            (broker) => broker.status === "Pending"
          ).length,
          totalAppointments: 12,
          callsMadeToday: 18,
          missedCalls: 5,
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data.");
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={{ marginBottom: 20, backgroundColor: "transparent" }}>
      <Card style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>Calls Insights</Text>
        <View style={styles.kpiContainer}>
          <View
            style={[
              styles.kpiCard,
              { backgroundColor: themeColors.cardShadow },
            ]}
          >
            <Text style={styles.kpiValue}>{insights.callsMadeToday}</Text>
            <Text style={styles.kpiLabel}>Calls Today</Text>
          </View>
          <View
            style={[
              styles.kpiCard,
              { backgroundColor: themeColors.cardShadow },
            ]}
          >
            <Text style={styles.kpiValue}>{insights.missedCalls}</Text>
            <Text style={styles.kpiLabel}>Missed Calls</Text>
          </View>
          <View
            style={[
              styles.kpiCard,
              { backgroundColor: themeColors.cardShadow },
            ]}
          >
            <Text style={styles.kpiValue}>{insights.totalAppointments}</Text>
            <Text style={styles.kpiLabel}>Appointments</Text>
          </View>
        </View>
      </Card>

      {/* Agency Modal */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Agency:</Text>
        {isAgencyLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <ModalSelector
            data={agencies.map((agency) => ({
              key: agency.Id,
              label: agency.Name,
            }))}
            initValue={
              selectedAgency
                ? agencies.find((agency) => agency.Id === selectedAgency)?.Name
                : "Select an agency"
            }
            onChange={(option) => setSelectedAgency(option.key)}
            style={styles.modal}
            cancelStyle={{ backgroundColor: themeColors.cardShadow }}
            optionContainerStyle={styles.modalOptions}
            keyExtractor={(item) => item.key} // Ensure unique key extraction
          />
        )}
      </View>

      {/* Call Sentiment Chart */}
      <Card>
        <Text style={styles.sectionTitle}>Calls Sentiment</Text>
        <PieChart
          data={[
            {
              name: "Positive",
              population: callLogs.filter((call) => call.sentiment > 3).length,
              color: "#4caf50",
              legendFontColor: themeColors.text,
              legendFontSize: 14,
            },
            {
              name: "Negative",
              population: callLogs.filter((call) => call.sentiment <= 3).length,
              color: "#f44336",
              legendFontColor: themeColors.text,
              legendFontSize: 14,
            },
            {
              name: "Neutral",
              population: callLogs.filter((call) => call.sentiment === 0)
                .length,
              color: "#9e9e9e",
              legendFontColor: themeColors.text,
              legendFontSize: 14,
            },
          ]}
          width={Dimensions.get("window").width - 70}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
        />
      </Card>

      {/* Broker Opportunities Chart */}
      <Card>
        <Text style={styles.sectionTitle}>Broker Opportunities</Text>
        <BarChart
          data={{
            labels: brokers.map((broker) => broker.name),
            datasets: [
              {
                data: brokers.map((broker) => broker.opportunities),
              },
            ],
          }}
          width={Dimensions.get("window").width - 70}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: colorScheme === "dark" ? "#333" : "#efefef",
            backgroundGradientTo: colorScheme === "dark" ? "#333" : "#efefef",
            color:
              colorScheme === "dark"
                ? (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                : (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={brokers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/modal",
                  params: {
                    agencyName: item.name,
                    agencyLocation: item.location,
                    agencyPhone: item.phone,
                    agencyTasks: JSON.stringify(item.tasks),
                  },
                })
              }
            >
              <Card>
                <View style={styles.brokerContainer}>
                  <View style={{ flex: 1, backgroundColor: "transparent" }}>
                    <Text style={styles.brokerName}>{item.name}</Text>
                    <Text style={styles.brokerLocation}>{item.location}</Text>
                    <Text style={styles.brokerStatus}>
                      Status: {item.status}
                    </Text>
                    <Text style={styles.brokerOpportunities}>
                      Opportunities: {item.opportunities}
                    </Text>
                  </View>
                  {/* Optional info icon */}
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={colors[colorScheme ?? "light"].text}
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          )}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 18,
    backgroundColor: "transparent",
  },
  kpiCard: {
    alignItems: "center",
    flex: 1,
    borderRadius: 10,
    margin: 2,
    padding: 10,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  kpiLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  brokerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  brokerName: {
    fontSize: 18,
    fontWeight: "600",
  },
  brokerLocation: {
    fontSize: 14,
    color: "#777",
    marginVertical: 5,
  },
  brokerStatus: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
  },
  brokerOpportunities: {
    fontSize: 14,
    color: "#444",
  },
  taskTitle: {
    marginTop: 10,
    fontWeight: "600",
  },
  taskItem: {
    color: "#007AFF",
    marginVertical: 3,
  },
  chart: {
    marginTop: 10,
    borderRadius: 8,
  },
  dropdownContainer: {
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modal: {
    padding: 10,
  },
  modalOptions: {
    marginTop: 100,
    marginBottom: 30,
  },
});
