import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

// Medical-grade color palette
const MEDICAL_COLORS = {
  primary: '#0A7B79', // Teal - Trust/Healthcare
  emergency: '#D32F2F', // Red - Emergency
  accent: '#1976D2', // Blue - Action
  background: '#F8F9FA', // Light background
  surface: '#FFFFFF', // Cards/containers
  textPrimary: '#2E3A4D', // Dark text
  textSecondary: '#5A6779', // Secondary text
  success: '#388E3C', // Green - Positive status
  warning: '#F57C00', // Orange - Warning
};

function MedicalActionButton({ icon, label, color, onPress, delay, isEmergency = false }) {
  return (
    <Animatable.View 
      animation="fadeInUp" 
      delay={delay}
      style={isEmergency ? styles.emergencyButtonWrapper : null}
    >
      <TouchableOpacity 
        style={[
          styles.actionButton,
          { backgroundColor: color },
          isEmergency && styles.emergencyButton
        ]} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.buttonIconContainer}>
          <Icon 
            name={icon} 
            size={isEmergency ? 28 : 24} 
            color="#FFF" 
            style={isEmergency ? { marginBottom: 5 } : null}
          />
        </View>
        <Text style={[
          styles.buttonLabel,
          isEmergency && styles.emergencyButtonLabel
        ]}>
          {label}
        </Text>
        {!isEmergency && (
          <Icon 
            name="chevron-right" 
            size={20} 
            color="rgba(255,255,255,0.7)" 
            style={styles.buttonChevron}
          />
        )}
      </TouchableOpacity>
    </Animatable.View>
  );
}

export default function HomeScreen({ navigation }) {
  const [userName] = useState('Sam');
  const [location, setLocation] = useState(null);
  const [vitalStatus, setVitalStatus] = useState('Stable');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();
    
    // Simulate vital status monitoring
    const interval = setInterval(() => {
      setVitalStatus(['Stable', 'Normal', 'Good'][Math.floor(Math.random() * 3)]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const medicalFeatures = [
    { 
      icon: 'heart-pulse', 
      label: 'Vitals Check', 
      color: MEDICAL_COLORS.primary,
      screen: 'Vitals'
    },
    { 
      icon: 'medical-bag', 
      label: 'First Aid', 
      color: MEDICAL_COLORS.accent,
      screen: 'FirstAid'
    },
    { 
      icon: 'doctor', 
      label: 'Telemedicine', 
      color: '#5D5FEF',
      screen: 'Telemedicine'
    },
    { 
      icon: 'pill', 
      label: 'Medications', 
      color: '#6C47FF',
      screen: 'Medications'
    },
    { 
      icon: 'medical-bag', 
      label: 'Emergency Kit', 
      color: MEDICAL_COLORS.warning,
      screen: 'EmergencyKit'
    },
    { 
      icon: 'history', 
      label: 'Health Records', 
      color: '#4E7AC7',
      screen: 'HealthRecords'
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MEDICAL_COLORS.primary} />

      {/* Header with Medical Gradient */}
      <LinearGradient 
        colors={[MEDICAL_COLORS.primary, '#128C8A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome back, {userName}</Text>
          <Text style={styles.subtitle}>Your health and safety come first</Text>
        </View>

        {/* Vital Status Indicator */}
        <View style={styles.vitalStatusContainer}>
          <View style={styles.vitalStatusPill}>
            <Icon name="heart-pulse" size={16} color="#FFF" />
            <Text style={styles.vitalStatusText}>{vitalStatus}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Emergency SOS Floating Button */}
      <View style={styles.sosContainer}>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => navigation.navigate('Emergency')}
        >
          <LottieView
            source={require('../assets/lottie/ambulance.json')}
            autoPlay
            loop
            style={styles.sosAnimation}
          />
          <Text style={styles.sosText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location and Emergency Contacts */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={18} color={MEDICAL_COLORS.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {location ? 
                `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
                'Waiting for location...'}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.emergencyContactButton}>
            <Icon name="contacts" size={18} color={MEDICAL_COLORS.emergency} />
            <Text style={[styles.infoText, { color: MEDICAL_COLORS.emergency }]}>
              Emergency Contacts
            </Text>
            <Icon name="chevron-right" size={18} color={MEDICAL_COLORS.emergency} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Medical Services</Text>
        <View style={styles.actionsGrid}>
          {medicalFeatures.map((feature, index) => (
            <MedicalActionButton
              key={feature.label}
              icon={feature.icon}
              label={feature.label}
              color={feature.color}
              delay={100 + (index * 100)}
              onPress={() => navigation.navigate(feature.screen)}
            />
          ))}
        </View>

        {/* Emergency Services Section */}
        <Text style={styles.sectionTitle}>Emergency Services</Text>
        <View style={styles.emergencyServices}>
          <MedicalActionButton
            icon="ambulance"
            label="Call Ambulance"
            color={MEDICAL_COLORS.emergency}
            delay={100}
            isEmergency
            onPress={() => navigation.navigate('Ambulance')}
          />
          <MedicalActionButton
            icon="hospital"
            label="Nearest Hospital"
            color="#C2185B"
            delay={200}
            isEmergency
            onPress={() => navigation.navigate('Hospitals')}
          />
        </View>

        {/* Health Tips Section */}
        <View style={styles.healthTipsContainer}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <ImageBackground
            source={require('../assets/images/avatar.png')}
            style={styles.healthTipCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent']}
              style={styles.tipGradient}
            >
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipText}>
                Drink at least 8 glasses of water daily to maintain optimal body function.
              </Text>
            </LinearGradient>
          </ImageBackground>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MEDICAL_COLORS.background,
  },
  header: {
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerContent: {
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
  },
  vitalStatusContainer: {
    position: 'absolute',
    top: 50,
    right: 24,
  },
  vitalStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  vitalStatusText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  sosContainer: {
    position: 'absolute',
    top: 170,
    alignSelf: 'center',
    zIndex: 10,
  },
  sosButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: MEDICAL_COLORS.emergency,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: MEDICAL_COLORS.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sosAnimation: {
    width: 90,
    height: 90,
    position: 'absolute',
  },
  sosText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 42,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginTop: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  infoSection: {
    backgroundColor: MEDICAL_COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    color: MEDICAL_COLORS.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  emergencyContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MEDICAL_COLORS.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  buttonIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  buttonChevron: {
    marginLeft: 'auto',
  },
  emergencyButtonWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  emergencyButton: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emergencyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  emergencyServices: {
    marginBottom: 20,
  },
  healthTipsContainer: {
    marginTop: 8,
  },
  healthTipCard: {
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  tipGradient: {
    padding: 16,
  },
  tipTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
});