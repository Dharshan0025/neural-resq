import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default function EmergencySetupScreen({ navigation }) {
  const [locationStatus, setLocationStatus] = useState('unknown');
  const [micStatus, setMicStatus] = useState('unknown');
  const [name, setName] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationStatus(status);
    if (status !== 'granted') Alert.alert('Location permission denied. Many features will not work!');
  };

  const requestMicrophonePermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    setMicStatus(status);
    if (status !== 'granted') Alert.alert('Microphone permission denied. SOS voice activation will not work!');
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const addContact = () => setContacts([...contacts, { name: '', phone: '' }]);

  const isFormValid = () =>
    name.trim().length > 0 &&
    contacts.every(c => c.name.trim() && c.phone.trim().length >= 10);

  const handleCompleteSetup = () => {
    if (!isFormValid()) {
      Alert.alert('Please fill all required fields before continuing.');
      return;
    }
    // TODO: Save to Firebase Firestore here if desired
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Emergency Setup</Text>
      <TouchableOpacity style={styles.permissionBtn} onPress={requestLocationPermission}>
        <Text style={styles.permissionText}>
          {locationStatus === 'granted' ? '✅ Location Enabled' : 'Enable Location'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.permissionBtn} onPress={requestMicrophonePermission}>
        <Text style={styles.permissionText}>
          {micStatus === 'granted' ? '✅ Microphone Enabled' : 'Enable Microphone'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Any Medical Notes (allergies, etc.)"
        value={medicalNotes}
        onChangeText={setMedicalNotes}
      />
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.contactRow}>
            <TextInput
              style={[styles.input, { flex: 2, marginRight: 5 }]}
              placeholder="Name"
              value={item.name}
              onChangeText={text => updateContact(index, 'name', text)}
            />
            <TextInput
              style={[styles.input, { flex: 3 }]}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={item.phone}
              onChangeText={text => updateContact(index, 'phone', text)}
              maxLength={14}
            />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addContactBtn} onPress={addContact}>
            <Text style={styles.addContactText}>+ Add Another Contact</Text>
          </TouchableOpacity>
        }
      />
      <TouchableOpacity
        style={[styles.completeBtn, { backgroundColor: isFormValid() ? '#F6C90E' : '#eccc81' }]}
        onPress={handleCompleteSetup}
        disabled={!isFormValid()}
      >
        <Text style={styles.completeBtnText}>Continue to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A2239', padding: 24 },
  heading: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 14, textAlign: 'center' },
  permissionBtn: { backgroundColor: '#003973', borderRadius: 18, marginVertical: 8, padding: 14, alignItems: 'center' },
  permissionText: { color: '#F6C90E', fontWeight: 'bold', fontSize: 16 },
  input: { backgroundColor: '#fff', borderRadius: 10, marginVertical: 8, padding: 10, fontSize: 16 },
  sectionTitle: { color: '#fff', fontWeight: 'bold', marginTop: 18, fontSize: 18, marginBottom: 6 },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  addContactBtn: { marginVertical: 14, alignSelf: 'center' },
  addContactText: { color: '#F6C90E', fontWeight: 'bold' },
  completeBtn: { marginTop: 30, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  completeBtnText: { color: '#0A2239', fontWeight: 'bold', fontSize: 18 }
});
