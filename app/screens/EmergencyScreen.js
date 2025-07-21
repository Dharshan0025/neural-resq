// app/screens/EmergencyScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const EmergencyScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>🚨 Emergency Features</Text>
      <Button title="Back to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
    </View>
  );
};

export default EmergencyScreen;
