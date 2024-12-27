import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native'

import { Text, View } from '@/components/Themed'
import { LinearGradient } from 'expo-linear-gradient'
import { useColorScheme } from '@/components/useColorScheme'
import colors from '@/constants/Colors'
import { BarChart, PieChart } from 'react-native-chart-kit'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'

// Card component (reuse existing)
import Card from '@/components/Card'

export default function ModalScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = colors[colorScheme]
  const { agencyName, agencyLocation, agencyPhone, agencyTasks } =
    useLocalSearchParams()

  // Mock data
  const mockAgentData = {
    name: agencyName ?? 'Agency Name',
    location: agencyLocation ?? 'Location',
    phone: agencyPhone ?? '123-456-7890',
    tasks: agencyTasks ?? ['Task 1', 'Task 2', 'Task 3'],
    performance: {
      ytdLossRatio: 12.5,
      monthlyLossRatios: [9.5, 11.5, 13.0, 12.5, 12.0],
      claimsProcessed: 150,
      topPolicies: ['BI', 'UMBI', 'PD'],
      agentPerformance: [
        { name: 'Agent A', value: 40 },
        { name: 'Agent B', value: 30 },
        { name: 'Agent C', value: 20 },
        { name: 'Agent D', value: 10 },
      ],
    },
    rnaDates: ['2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
  }

  // State to toggle the menu modal
  const [menuVisible, setMenuVisible] = useState(false)

  const handleAction = (action: string) => {
    alert(`Action: ${action}`)
    setMenuVisible(false)
  }

  const gradientColors: [string, string] =
    colorScheme === 'light'
      ? [themeColors.neuBackground, themeColors.neuShadowDark]
      : [themeColors.neuBackground, themeColors.neuShadowLight]

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient behind everything */}
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Card #1: Agent Info */}
          <Card>
            <Text style={styles.sectionTitle}>Agent Info</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Name:</Text> {mockAgentData.name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Location:</Text>{' '}
              {mockAgentData.location}
            </Text>
          </Card>

          {/* Card #2: YTD Performance */}
          <Card>
            <Text style={styles.sectionTitle}>YTD Performance</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>YTD Loss Ratio:</Text>{' '}
              {mockAgentData.performance.ytdLossRatio}%
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Claims Processed:</Text>{' '}
              {mockAgentData.performance.claimsProcessed}
            </Text>
          </Card>

          {/* Card #3: Monthly Loss Ratios */}
          <Card>
            <Text style={styles.sectionTitle}>Monthly Loss Ratios</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: mockAgentData.rnaDates,
                  datasets: [
                    {
                      data: mockAgentData.performance.monthlyLossRatios,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 100}
                height={220}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={{
                  backgroundColor: '#007AFF',
                  backgroundGradientFrom: '#007AFF',
                  backgroundGradientTo: '#4F94FF',
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  barPercentage: 0.5,
                }}
                style={styles.chart}
              />
            </View>
          </Card>

          {/* Card #4: Agent Performance */}
          <Card>
            <Text style={styles.sectionTitle}>Agent Performance</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={mockAgentData.performance.agentPerformance.map(
                  (item) => ({
                    name: item.name,
                    population: item.value,
                    color: `#${Math.floor(Math.random() * 16777215).toString(
                      16,
                    )}`,
                    legendFontColor: themeColors.text,
                    legendFontSize: 15,
                  }),
                )}
                width={Dimensions.get('window').width - 100}
                height={220}
                chartConfig={{
                  backgroundColor: themeColors.background,
                  backgroundGradientFrom: themeColors.background,
                  backgroundGradientTo: themeColors.background,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                absolute
              />
            </View>
          </Card>

          {/* Card #5: Top Policies */}
          <Card>
            <Text style={styles.sectionTitle}>Top Policies Sold</Text>
            {mockAgentData.performance.topPolicies.map((policy, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {policy}
              </Text>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colorScheme === 'light' ? '#007AFF' : '#444444',
            shadowColor: themeColors.neuShadowDark,
          },
        ]}
        onPress={() => setMenuVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Fullscreen Modal for Menu */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={[
            styles.modalContainer,
            { backgroundColor: themeColors.cardBackgroundSemiTransparent },
          ]}
          onPress={() => setMenuVisible(false)} // Dismiss on outside press
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeColors.cardShadow },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction('Contact Agent')}
            >
              <MaterialIcons name="phone" size={24} color={themeColors.text} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                Contact Agent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction('View Report')}
            >
              <MaterialIcons
                name="article"
                size={24}
                color={themeColors.text}
              />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                View Report
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction('Reload Data')}
            >
              <MaterialIcons
                name="refresh"
                size={24}
                color={themeColors.text}
              />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                Reload Data
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction('Refresh')}
            >
              <MaterialIcons name="sync" size={24} color={themeColors.text} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  chart: {
    marginTop: 10,
    borderRadius: 10,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 8,
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
  },
})
