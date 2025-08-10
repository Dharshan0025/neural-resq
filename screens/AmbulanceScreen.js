import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const AmbulanceScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedType, setSelectedType] = useState('BLS');
  const [hospitals] = useState([
    { id: 1, name: 'City General Hospital', latitude: 12.9716, longitude: 77.5946 },
    { id: 2, name: 'Metro Medical Center', latitude: 12.9352, longitude: 77.6245 },
  ]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const handleRequestAmbulance = () => {
    // In a real app, this would dispatch the ambulance request
    navigation.navigate('AmbulanceConfirmation', {
      type: selectedType,
      hospital: selectedHospital,
      userLocation: location
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#D62828', '#F77F00']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Ambulance</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            >
              <View style={styles.userMarker}>
                <MaterialIcons name="person-pin-circle" size={32} color="#D62828" />
              </View>
            </Marker>

            {hospitals.map(hospital => (
              <Marker
                key={hospital.id}
                coordinate={{
                  latitude: hospital.latitude,
                  longitude: hospital.longitude,
                }}
                title={hospital.name}
                onPress={() => setSelectedHospital(hospital)}
              >
                <View style={[
                  styles.hospitalMarker,
                  selectedHospital?.id === hospital.id && styles.selectedHospitalMarker
                ]}>
                  <FontAwesome5 name="hospital" size={20} color="white" />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text>{errorMsg || 'Loading map...'}</Text>
          </View>
        )}
      </View>

      {/* Ambulance Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ambulance Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'BLS' && styles.selectedTypeButton
            ]}
            onPress={() => setSelectedType('BLS')}
          >
            <FontAwesome5 name="ambulance" size={20} color={selectedType === 'BLS' ? 'white' : '#D62828'} />
            <Text style={[
              styles.typeText,
              selectedType === 'BLS' && styles.selectedTypeText
            ]}>
              Basic Life Support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'ALS' && styles.selectedTypeButton
            ]}
            onPress={() => setSelectedType('ALS')}
          >
            <MaterialIcons name="local-hospital" size={24} color={selectedType === 'ALS' ? 'white' : '#D62828'} />
            <Text style={[
              styles.typeText,
              selectedType === 'ALS' && styles.selectedTypeText
            ]}>
              Advanced Life Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hospital Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destination Hospital</Text>
        <TouchableOpacity
          style={styles.hospitalInput}
          onPress={() => navigation.navigate('HospitalSelection', { hospitals })}
        >
          <Text style={styles.hospitalText}>
            {selectedHospital ? selectedHospital.name : 'Select hospital (optional)'}
          </Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Request Button */}
      <TouchableOpacity
        style={styles.requestButton}
        onPress={handleRequestAmbulance}
        disabled={!location}
      >
        <LinearGradient
          colors={['#D62828', '#F77F00']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.requestButtonText}>REQUEST AMBULANCE</Text>
          <FontAwesome5 name="ambulance" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
  mapContainer: {
    height: 250,
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  map: {
    flex: 1,
  },
  loadingMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  userMarker: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 2,
  },
  hospitalMarker: {
    backgroundColor: '#0077B6',
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedHospitalMarker: {
    backgroundColor: '#D62828',
    transform: [{ scale: 1.2 }],
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
  },
  selectedTypeButton: {
    backgroundColor: '#D62828',
  },
  typeText: {
    marginLeft: 10,
    color: '#D62828',
    fontFamily: 'Poppins_500Medium',
  },
  selectedTypeText: {
    color: 'white',
  },
  hospitalInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  hospitalText: {
    color: '#555',
    fontFamily: 'Poppins_400Regular',
  },
  requestButton: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  buttonGradient: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default AmbulanceScreen;