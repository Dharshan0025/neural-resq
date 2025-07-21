// app/auth/login.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert } from 'react-native';
//import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/config/firebase'; // adjust path as needed
import Dashboard from '../screens/Dashboard'; // ✅ correct
import { useNavigation } from '@react-navigation/native';

 

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Missing Fields', 'Email and password are required.');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    Alert.alert('Success', 'Logged in!');
    navigation.replace('../screens/Dashboard');
  } catch (error) {
  console.log('Login error:', error);

  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      Alert.alert('Login Failed', 'Incorrect email or password');
      break;  
    case 'auth/invalid-email':
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      break;
    case 'auth/invalid-credential':
      Alert.alert('Invalid Credential', 'Email or password is incorrect');
      break;
    default:
      Alert.alert('Error', error.message);
      break;
  }
}

};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

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

      <Button title="Login" onPress={handleLogin} />

      <Pressable onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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
