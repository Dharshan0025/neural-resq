// app/screens/Dashboard.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { auth } from '../../src/config/firebase';

const Dashboard = ({ navigation }) => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>👋 Welcome to the Dashboard!</Text>
      <Button title="Go to Emergency" onPress={() => navigation.navigate('Emergency')} />
      <Button title="Logout" color="red" onPress={handleLogout} />
    </View>
  );
};

export default Dashboard;
