// app/dashboard.jsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../src/config/firebase';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/auth/login');
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 You are logged in!</Text>
      <Text style={styles.subtitle}>Email: {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 16 },
});
