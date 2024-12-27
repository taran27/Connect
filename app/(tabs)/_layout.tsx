import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs } from 'expo-router'
import { Pressable, Text } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { View } from '@/components/Themed'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useLogout'

const getGreeting = (): string => {
  const currentHour = new Date().getHours()
  if (currentHour < 12) return 'Good Morning'
  if (currentHour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

function TabBarIcon(props: {
  readonly name: React.ComponentProps<typeof FontAwesome>['name']
  readonly color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { userInfo } = useAuthStore()
  const { logout } = useLogout()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          height: 120, // Adjust the height value as needed
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => (
            <Text
              style={{
                color: Colors[colorScheme ?? 'light'].text,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'left',
              }}
            >
              {getGreeting()},{' '}
              <Text style={{ color: '#007AFF', fontSize: 22 }}>
                {userInfo?.first_name || 'User'}
              </Text>{' '}
              👋
            </Text>
          ),
          headerRight: () => (
            <Pressable onPress={logout}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <FontAwesome
                    name="sign-out"
                    size={20}
                    color="red"
                    style={{ marginRight: 5, opacity: pressed ? 0.5 : 1 }}
                  />
                  <Text
                    style={{
                      color: 'red',
                      marginRight: 15,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  >
                    Logout
                  </Text>
                </View>
              )}
            </Pressable>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitleAlign: 'left',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
          headerRight: () => (
            <Link href="/calander-modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="calendar"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerTitleAlign: 'left',
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Profile',
          headerTitle: () => (
            <Text
              style={{
                color: Colors[colorScheme ?? 'light'].text,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'left',
              }}
            >
              {getGreeting()},{' '}
              <Text style={{ color: '#007AFF', fontSize: 22 }}>
                {userInfo?.first_name || 'User'}
              </Text>{' '}
              👋
            </Text>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerRight: () => (
            <Pressable onPress={logout}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <FontAwesome
                    name="sign-out"
                    size={20}
                    color="red"
                    style={{ marginRight: 5, opacity: pressed ? 0.5 : 1 }}
                  />
                  <Text
                    style={{
                      color: 'red',
                      marginRight: 15,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  >
                    Logout
                  </Text>
                </View>
              )}
            </Pressable>
          ),
          headerTitleAlign: 'left',
        }}
      />
    </Tabs>
  )
}
