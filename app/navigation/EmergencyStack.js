// app/navigation/EmergencyStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmergencyScreen from '../screens/EmergencyScreen'; // create this

const Stack = createNativeStackNavigator();

const EmergencyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default EmergencyStack;
