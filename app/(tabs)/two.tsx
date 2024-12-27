import React, { useState, useEffect } from 'react'
import MapView, { Marker, Region } from 'react-native-maps'
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import Card from '@/components/Card'
import { Text } from '@/components/Themed'

interface Appointment {
  id: string
  title: string
  time: string
  address: string
  notes: string
  latitude: number
  longitude: number
}

export default function TabTwoScreen() {
  const router = useRouter()

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [mapRegion, setMapRegion] = useState<Region | null>(null)
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Agency XYZ: John Smith',
      time: '10:00 AM',
      address: '123 Main St, San Francisco, CA',
      notes: 'Discuss policy updates and new rates.',
      latitude: 37.78825,
      longitude: -122.4324,
    },
    {
      id: '2',
      title: 'New Dawn: Sarah Johnson',
      time: '1:00 PM',
      address: '456 Market St, San Francisco, CA',
      notes: 'Finalize renewal agreements.',
      latitude: 37.78925,
      longitude: -122.4224,
    },
    {
      id: '3',
      title: 'Project Data: David Lee',
      time: '3:00 PM',
      address: '789 Mission St, San Francisco, CA',
      notes: 'Review client portfolio performance.',
      latitude: 37.79025,
      longitude: -122.4124,
    },
  ])

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied.',
        )
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation.coords)
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      })
    })()
  }, [])

  const handleAppointmentClick = (appointment: Appointment) => {
    const todayDate = new Date().toISOString().split('T')[0]
    const timeParts = appointment.time.split(/[: ]/)
    const hours =
      timeParts[2] === 'PM' && +timeParts[0] !== 12
        ? +timeParts[0] + 12
        : +timeParts[0]
    const formattedTime = `${todayDate}T${hours.toString().padStart(2, '0')}:${
      timeParts[1]
    }:00`

    const formattedAppointment = {
      ...appointment,
      time: formattedTime, // Use the formatted ISO time
    }

    if (!isScrolling) {
      if (selectedAppointment?.id === appointment.id) {
        openDetailModal(formattedAppointment) // Open modal with formatted time
      } else {
        setSelectedAppointment(formattedAppointment) // Select the card
        setMapRegion({
          latitude: appointment.latitude,
          longitude: appointment.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        })
      }
    }
  }

  const openDetailModal = (appointment: Appointment) => {
    router.push({
      pathname: '/detail-modal',
      params: { appointment: JSON.stringify(appointment) },
    })
  }

  return (
    <View style={styles.container}>
      {/* Map Section */}
      {mapRegion ? (
        <MapView style={styles.map} region={mapRegion}>
          <Marker
            coordinate={{
              latitude: location?.latitude ?? mapRegion.latitude,
              longitude: location?.longitude ?? mapRegion.longitude,
            }}
            title="Your Location"
          />
          {selectedAppointment ? (
            <Marker
              key={selectedAppointment.id}
              coordinate={{
                latitude: selectedAppointment.latitude,
                longitude: selectedAppointment.longitude,
              }}
              title={selectedAppointment.title}
              description={`Time: ${selectedAppointment.time}`}
            />
          ) : (
            appointments.map((appointment) => (
              <Marker
                key={appointment.id}
                coordinate={{
                  latitude: appointment.latitude,
                  longitude: appointment.longitude,
                }}
                title={appointment.title}
                description={`Time: ${appointment.time}`}
              />
            ))
          )}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Loading Map...</Text>
      )}

      {/* Appointment List Overlay */}
      <View style={styles.appointmentsContainer}>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAppointmentClick(item)}>
              <Card
                style={[
                  styles.appointmentCard,
                  selectedAppointment?.id === item.id && styles.selectedCard,
                ]}
              >
                <View>
                  <Text style={styles.appointmentTitle}>{item.title}</Text>
                  <Text style={styles.appointmentTime}>{item.time}</Text>
                  <Text style={styles.appointmentAddress}>{item.address}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => setIsScrolling(true)} // Start scrolling
          onScrollEndDrag={() => setIsScrolling(false)} // Stop scrolling
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  appointmentsContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 15,
  },
  appointmentCard: {
    padding: 20,
    marginRight: 15,
    width: Dimensions.get('window').width * 0.8,
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: "#333",
  },
  appointmentTime: {
    fontSize: 14,
    // color: "#555",
    marginBottom: 5,
  },
  appointmentAddress: {
    fontSize: 14,
    // color: "#777",
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    // color: "gray",
    marginTop: 20,
  },
})
