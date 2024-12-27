import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Linking from 'expo-linking'
import { MaterialIcons } from '@expo/vector-icons'
import { Text, View } from '@/components/Themed'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from '@/components/useColorScheme'
import colors from '@/constants/Colors'
import * as Speech from 'expo-speech'

export default function DetailsModalScreen() {
  const searchParams = useLocalSearchParams()
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = colors[colorScheme]

  // Parse the appointment
  const appointment = searchParams.appointment
    ? JSON.parse(searchParams.appointment as string)
    : null

  const [notes, setNotes] = useState(appointment?.notes || '')
  const [timeLeft, setTimeLeft] = useState('')
  const [menuVisible, setMenuVisible] = useState(false)

  // Time-left calculation
  useEffect(() => {
    if (!appointment?.time) {
      setTimeLeft('Time not available')
      return
    }

    const interval = setInterval(() => {
      const appointmentTime = new Date(appointment.time)
      const now = new Date()

      if (isNaN(appointmentTime.getTime())) {
        setTimeLeft('Invalid time format')
        clearInterval(interval)
        return
      }

      const diff = appointmentTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('Started or Passed')
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        setTimeLeft(`${hours} hrs ${minutes} mins`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [appointment?.time])

  const checkInToAppointment = () => {
    Alert.alert(
      'Checked In',
      `You have successfully checked in to ${appointment.title}.`,
    )
  }

  const handleTextToSpeech = () => {
    if (notes.trim() === '') {
      Alert.alert('No Notes', 'There are no notes to read aloud.')
      return
    }
    Speech.speak(notes, { language: 'en-US' })
  }

  const openInMaps = () => {
    const { latitude, longitude } = appointment
    let url = ''
    if (Platform.OS === 'ios') {
      url = `maps://?q=${latitude},${longitude}`
    } else if (Platform.OS === 'android') {
      url = `geo:${latitude},${longitude}?q=${latitude},${longitude}`
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    }

    Linking.openURL(url).catch((err) => {
      Alert.alert(
        'Error',
        'Unable to open maps. Please check your settings or try again later.',
      )
      console.error('Failed to open maps:', err)
    })
  }

  const rescheduleAppointment = () => {
    Alert.alert(
      'Reschedule Appointment',
      `You can reschedule ${appointment.title}.`,
    )
  }

  const cancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel ${appointment.title}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => Alert.alert('Canceled', 'Appointment canceled.'),
        },
      ],
    )
  }

  const saveNotes = () => {
    Alert.alert(
      'Notes Saved',
      `Your notes for ${appointment.title} have been updated.`,
    )
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No details available</Text>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: appointment.latitude,
          longitude: appointment.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{
            latitude: appointment.latitude,
            longitude: appointment.longitude,
          }}
          title={appointment.title}
          description={appointment.address}
        />
      </MapView>

      {/* Appointment Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.title}>Appointment Details</Text>
        <View
          style={[styles.info, { backgroundColor: themeColors.cardBackground }]}
        >
          <Text style={styles.text}>
            <Text style={styles.bold}>Title:</Text> {appointment.title}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Time:</Text> {appointment.time}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Address:</Text> {appointment.address}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Time Left:</Text> {timeLeft}
          </Text>
        </View>
      </View>

      {/* Notes Section */}
      <View style={styles.notesSection}>
        <Text style={styles.bold}>Notes</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: themeColors.text,
              backgroundColor: themeColors.neuShadowLight,
            },
          ]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes about this appointment..."
          multiline
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={saveNotes}
          >
            <Text style={styles.buttonText}>Save Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.readButton]}
            onPress={handleTextToSpeech}
          >
            <Text style={styles.buttonText}>Read Text</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setMenuVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeColors.cardBackground },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={checkInToAppointment}
            >
              <MaterialIcons name="check-circle" size={24} color="#007AFF" />
              <Text style={styles.menuText}>Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={openInMaps}>
              <MaterialIcons name="map" size={24} color="#007AFF" />
              <Text style={styles.menuText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={rescheduleAppointment}
            >
              <MaterialIcons name="event" size={24} color="#007AFF" />
              <Text style={styles.menuText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={cancelAppointment}
            >
              <MaterialIcons name="cancel" size={24} color="#FF0000" />
              <Text style={styles.menuText}>Cancel Appointment</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  detailsSection: {
    padding: 20,
  },
  info: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notesSection: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    alignItems: 'center',
    padding: 15,
    flex: 1,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginRight: 10,
  },
  readButton: {
    backgroundColor: '#48BB78', // Green for "Read Text" button
  },
  closeButton: {
    backgroundColor: '#FF0000',
    padding: 15,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
  },
})
