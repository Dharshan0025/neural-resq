// app/auth/signup.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert } from 'react-native';
//import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/config/firebase'; // adjust path as needed
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSignup = async () => {
  if (!email || !password || password !== confirmPass) {
    Alert.alert('Error', 'Please fill all fields and make sure passwords match.');
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    Alert.alert('Success', 'Account created!');
    router.push('/auth/login');
  } catch (error) {
    Alert.alert('Signup Failed', error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account ✨</Text>
      <Text style={styles.subtitle}>Join Neural ResQ to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        value={confirmPass}
        onChangeText={setConfirmPass}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleSignup} />

      <Pressable onPress={() => navigation.navigate('Login')} >
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  link: { marginTop: 16, color: '#007AFF', textAlign: 'center' },
});
