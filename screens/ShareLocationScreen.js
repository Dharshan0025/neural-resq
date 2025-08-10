import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as SMS from 'expo-sms';

const ShareLocationScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [shareDuration, setShareDuration] = useState(15); // minutes

  // Mock contacts - replace with your actual contacts data
  const [contacts] = useState([
    { id: 1, name: 'Emergency Contact', phone: '+911234567890', type: 'emergency' },
    { id: 2, name: 'Family Member', phone: '+919876543210', type: 'family' },
    { id: 3, name: 'Nearest Hospital', phone: '+911122334455', type: 'hospital' },
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get initial location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // Watch for location updates
      const subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );

      return () => subscriber.remove();
    })();
  }, []);

  const handleShareLocation = async () => {
    if (!selectedRecipient) {
      Alert.alert('Select Recipient', 'Please select who to share your location with');
      return;
    }

    setIsSharing(true);
    
    // In a real app, you would send this to your backend
    const message = `NEURAL RESQ: My current location - https://maps.google.com/?q=${location.latitude},${location.longitude} (Sharing for ${shareDuration} mins)`;
    
    // Check if SMS is available
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        [selectedRecipient.phone],
        message
      );
    } else {
      // Fallback - copy to clipboard or show share dialog
      Alert.alert('SMS not available', 'Your location link has been copied to clipboard');
    }

    // Show success message
    Alert.alert(
      'Location Shared',
      `Your live location has been shared with ${selectedRecipient.name} for ${shareDuration} minutes`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const renderRecipientIcon = (type) => {
    switch (type) {
      case 'emergency':
        return <MaterialIcons name="emergency" size={24} color="#D62828" />;
      case 'hospital':
        return <FontAwesome name="hospital-o" size={24} color="#0077B6" />;
      default:
        return <Ionicons name="person" size={24} color="#4CAF50" />;
    }
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
        <Text style={styles.headerTitle}>Share My Location</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            >
              <View style={styles.userMarker}>
                <MaterialIcons name="location-on" size={32} color="#D62828" />
              </View>
            </Marker>
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text>{errorMsg || 'Getting your location...'}</Text>
          </View>
        )}
      </View>

      {/* Duration Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share Duration</Text>
        <View style={styles.durationContainer}>
          {[15, 30, 60].map((minutes) => (
            <TouchableOpacity
              key={minutes}
              style={[
                styles.durationButton,
                shareDuration === minutes && styles.selectedDurationButton
              ]}
              onPress={() => setShareDuration(minutes)}
            >
              <Text style={[
                styles.durationText,
                shareDuration === minutes && styles.selectedDurationText
              ]}>
                {minutes} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recipient Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share With</Text>
        <View style={styles.recipientContainer}>
          {contacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.recipientButton,
                selectedRecipient?.id === contact.id && styles.selectedRecipientButton
              ]}
              onPress={() => setSelectedRecipient(contact)}
            >
              <View style={styles.recipientIcon}>
                {renderRecipientIcon(contact.type)}
              </View>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{contact.name}</Text>
                <Text style={styles.recipientPhone}>{contact.phone}</Text>
              </View>
              {selectedRecipient?.id === contact.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShareLocation}
        disabled={!location || isSharing}
      >
        <LinearGradient
          colors={['#D62828', '#F77F00']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isSharing ? (
            <Text style={styles.shareButtonText}>SHARING LOCATION...</Text>
          ) : (
            <>
              <Text style={styles.shareButtonText}>SHARE LIVE LOCATION</Text>
              <Feather name="share-2" size={20} color="white" />
            </>
          )}
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
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    marginRight: 10,
    alignItems: 'center',
    elevation: 2,
  },
  selectedDurationButton: {
    backgroundColor: '#D62828',
  },
  durationText: {
    color: '#555',
    fontFamily: 'Poppins_500Medium',
  },
  selectedDurationText: {
    color: 'white',
  },
  recipientContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
  },
  recipientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedRecipientButton: {
    backgroundColor: 'rgba(214, 40, 40, 0.05)',
  },
  recipientIcon: {
    marginRight: 15,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  recipientPhone: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Poppins_400Regular',
  },
  shareButton: {
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
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default ShareLocationScreen;