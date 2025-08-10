import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import EmergencySetupScreen from './screens/EmergencySetupScreen';
import HomeScreen from './screens/HomeScreen';
import SOSScreen from './screens/SOSScreen';
import AmbulanceScreen from './screens/AmbulanceScreen';
import ShareLocationScreen from './screens/ShareLocationScreen';
import VolunteersScreen from './screens/VolunteersScreen';
import IncidentHistoryScreen from './screens/IncidentHistoryScreen';
import WalletScreen from './screens/WalletScreen';
// import AdminDashboardScreen from './screens/AdminDashboardScreen'; // if created

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmergencySetup" component={EmergencySetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SOS" component={SOSScreen} />
        <Stack.Screen name="Ambulance" component={AmbulanceScreen} />
        <Stack.Screen name="ShareLocation" component={ShareLocationScreen} />
        <Stack.Screen name="Volunteers" component={VolunteersScreen} />
        <Stack.Screen name="IncidentHistory" component={IncidentHistoryScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        {/* <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
