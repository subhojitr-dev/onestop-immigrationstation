import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, ActivityIndicator } from 'react-native'
import { useAuth } from '../lib/AuthContext'
import { Colors } from '../theme'

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen'
import SignupScreen from '../screens/auth/SignupScreen'

// Dashboard screens
import HomeScreen from '../screens/dashboard/HomeScreen'
import CasesScreen from '../screens/dashboard/CasesScreen'
import CaseDetailScreen from '../screens/dashboard/CaseDetailScreen'
import AppointmentsScreen from '../screens/dashboard/AppointmentsScreen'
import BookAppointmentScreen from '../screens/dashboard/BookAppointmentScreen'
import DocumentsScreen from '../screens/dashboard/DocumentsScreen'
import TicketsScreen from '../screens/dashboard/TicketsScreen'
import TicketDetailScreen from '../screens/dashboard/TicketDetailScreen'
import NewTicketScreen from '../screens/dashboard/NewTicketScreen'
import ProfileScreen from '../screens/dashboard/ProfileScreen'

// Apply screens (Phase 3)
import VisaSelectionScreen from '../screens/apply/VisaSelectionScreen'
import QuestionnaireScreen from '../screens/apply/QuestionnaireScreen'
import ApplicationStatusScreen from '../screens/apply/ApplicationStatusScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠', Cases: '📁', Appointments: '📅', Apply: '📝', Profile: '👤',
  }
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[name] ?? '•'}</Text>
  )
}

function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.navy,
          borderTopColor: Colors.navyMid,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, marginBottom: 4 },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Cases" component={CasesStack} />
      <Tab.Screen name="Apply" component={ApplyStack} />
      <Tab.Screen name="Appointments" component={AppointmentsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
    </Stack.Navigator>
  )
}

function CasesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CasesList" component={CasesScreen} />
      <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />
    </Stack.Navigator>
  )
}

function ApplyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VisaSelection" component={VisaSelectionScreen} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
      <Stack.Screen name="ApplicationStatus" component={ApplicationStatusScreen} />
    </Stack.Navigator>
  )
}

function AppointmentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppointmentsList" component={AppointmentsScreen} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <Stack.Screen name="Tickets" component={TicketsScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <Stack.Screen name="NewTicket" component={NewTicketScreen} />
    </Stack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  )
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a2744' }}>
      <ActivityIndicator size="large" color="#cfa94a" />
      <Text style={{ color: '#cfa94a', marginTop: 16, fontSize: 16 }}>Loading...</Text>
    </View>
  )
}

export default function AppNavigator() {
  const { session, loading } = useAuth()

  if (loading) return <LoadingScreen />

  return (
    <NavigationContainer>
      {session ? <DashboardTabs /> : <AuthStack />}
    </NavigationContainer>
  )
}
