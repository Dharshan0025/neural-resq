import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => navigation.replace('Onboarding'), 2000); // 2s delay
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NEURAL RESQ</Text>
      <Text style={styles.tagline}>When every second counts, NEURAL RESQ listens.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#003973' },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginTop: 20 },
  tagline: { marginTop: 16, fontSize: 18, color: '#eee', textAlign: 'center' }
});

export default SplashScreen;
