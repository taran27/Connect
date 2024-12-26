import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  Platform,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import * as CalendarAPI from "expo-calendar";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import colors from "@/constants/Colors";

export default function CalendarModal() {
  const [events, setEvents] = useState<CalendarAPI.Event[]>([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState<string>("All"); // Event filters
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = colors[colorScheme];

  useEffect(() => {
    (async () => {
      const granted = await getCalendarPermissions();
      setIsPermissionGranted(granted);
      if (granted) {
        fetchEvents();
      }
    })();
  }, []);

  const getCalendarPermissions = async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const { status } = await CalendarAPI.requestCalendarPermissionsAsync();
      return status === "granted";
    }
    return false;
  };

  const fetchEvents = async () => {
    const calendars = await CalendarAPI.getCalendarsAsync(
      CalendarAPI.EntityTypes.EVENT
    );
    if (calendars.length > 0) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); // Fetch events for the next 30 days
      const fetchedEvents = await CalendarAPI.getEventsAsync(
        calendars.map((cal) => cal.id),
        startDate,
        endDate
      );
      setEvents(fetchedEvents);

      // Process events for marked dates
      const dates = fetchedEvents.reduce((acc: Record<string, any>, event) => {
        const dateKey = (event.startDate as string).split("T")[0];
        acc[dateKey] = { marked: true, dotColor: "blue" };
        return acc;
      }, {});
      setMarkedDates(dates);
    }
  };

  const createEvent = async (title: string, location: string) => {
    if (!isPermissionGranted) {
      Alert.alert(
        "Permission Denied",
        "Cannot create events without permissions."
      );
      return;
    }
    const calendars = await CalendarAPI.getCalendarsAsync(
      CalendarAPI.EntityTypes.EVENT
    );
    const defaultCalendar = calendars.find(
      (cal) => cal.isPrimary || cal.source.name === "Default"
    );
    if (defaultCalendar) {
      await CalendarAPI.createEventAsync(defaultCalendar.id, {
        title,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // 1-hour event
        location,
      });
      Alert.alert(
        "Event Created",
        `Your "${title}" event has been added to the calendar.`
      );
      fetchEvents(); // Refresh events
    } else {
      Alert.alert("No Calendar Found", "Could not find a default calendar.");
    }
  };

  const renderEvent = ({ item }: { item: CalendarAPI.Event }) => (
    <TouchableOpacity
      style={[
        styles.eventCard,
        { backgroundColor: themeColors.cardBackground },
      ]}
      onPress={() => Alert.alert(item.title)}
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetails}>
        {(item.startDate as string).split("T")[0]} |{" "}
        {item.location || "No Location"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day: { dateString: string }) => {
          const selectedDateEvents = events.filter((event) =>
            (event.startDate as string).startsWith(day.dateString)
          );
          if (selectedDateEvents.length > 0) {
            Alert.alert(
              `Events on ${day.dateString}`,
              selectedDateEvents.map((e) => e.title).join("\n")
            );
          } else {
            Alert.alert("No Events", `No events on ${day.dateString}`);
          }
        }}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          selectedDayBackgroundColor: "#007AFF",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#FF0000",
          arrowColor: "#007AFF",
          dotColor: "#007AFF",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      {/* Filters and Statistics */}
      <View style={styles.filtersSection}>
        <Text style={styles.filtersTitle}>Filters:</Text>
        <View style={styles.filters}>
          {["All", "Work", "Personal", "Urgent"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                filters === filter && styles.activeFilter,
              ]}
              onPress={() => setFilters(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  filters === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="Add Meeting"
          onPress={() => createEvent("Meeting with Team", "Office")}
        />
        <Button
          title="Add Personal Event"
          onPress={() => createEvent("Doctor's Appointment", "Health Center")}
        />
        <Button
          title="Add Reminder"
          onPress={() => createEvent("Buy Groceries", "Supermarket")}
        />
      </View>

      {/* Upcoming Events Section */}
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        style={styles.eventList}
        showsVerticalScrollIndicator={false} // Hides the vertical scroll bar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filtersSection: {
    marginVertical: 15,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F0F0F0",
  },
  activeFilter: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    color: "#000",
  },
  activeFilterText: {
    color: "#FFF",
  },
  stats: {
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    marginVertical: 5,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  eventList: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  eventCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDetails: {
    fontSize: 14,
    color: "#666",
  },
});
