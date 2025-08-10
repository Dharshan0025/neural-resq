import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Animated, Easing, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const HomeScreen = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [shakeAnim] = useState(new Animated.Value(0));
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Pulsing animation for emergency button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Shake animation for emergency button
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleEmergencyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    triggerShake();
    setIsEmergencyActive(true);
    
    // Simulate emergency countdown
    setTimeout(() => {
      navigation.navigate('VoiceSOS');
      setIsEmergencyActive(false);
    }, 3000);
  };

  const emergencyButtonScale = pulseAnim.interpolate({
    inputRange: [1, 1.05],
    outputRange: [1, 1.05],
  });

  const emergencyButtonTranslateX = shakeAnim.interpolate({
    inputRange: [-10, 0, 10],
    outputRange: [-10, 0, 10],
  });

  const ActionCard = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.actionCard, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionIconContainer}>
        {icon}
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0A0F1F', '#1A2138']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi jhon 👋</Text>
              <Text style={styles.time}>{currentTime}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          {/* Location Card */}
          <View style={styles.locationCard}>
            <Ionicons name="location-sharp" size={20} color="#D62828" />
            <Text style={styles.locationText}>Bangalore, Karnataka</Text>
            <Feather name="chevron-right" size={18} color="#999" />
          </View>

          {/* Emergency Button */}
          <View style={styles.emergencyContainer}>
            <Animated.View 
              style={[
                styles.emergencyButton, 
                { 
                  transform: [
                    { scale: emergencyButtonScale },
                    { translateX: emergencyButtonTranslateX }
                  ] 
                }
              ]}
            >
              <TouchableOpacity 
                onPress={handleEmergencyPress}
                activeOpacity={0.7}
                style={styles.emergencyTouchable}
              >
                <LinearGradient
                  colors={isEmergencyActive ? ['#FF0000', '#D62828'] : ['#D62828', '#F77F00']}
                  style={styles.emergencyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons name="emergency" size={40} color="white" />
                  <Text style={styles.emergencyText}>
                    {isEmergencyActive ? 'SENDING HELP...' : 'VOICE SOS'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.emergencySubtext}>
              Hold or press for emergency assistance
            </Text>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <ActionCard
              icon={<FontAwesome5 name="ambulance" size={24} color="white" />}
              title="Request Ambulance"
              subtitle="Immediate medical transport"
              color="#0077B6"
              onPress={() => navigation.navigate('Ambulance')}
            />
            <ActionCard
              icon={<Ionicons name="location" size={24} color="white" />}
              title="Share Location"
              subtitle="Send live location"
              color="#4CAF50"
              onPress={() => navigation.navigate('ShareLocation')}
            />
            <ActionCard
              icon={<FontAwesome5 name="hands-helping" size={24} color="white" />}
              title="Volunteer Help"
              subtitle="Find nearby responders"
              color="#9C27B0"
              onPress={() => navigation.navigate('Volunteers')}
            />
            <ActionCard
              icon={<Ionicons name="wallet" size={24} color="white" />}
              title="Wallet"
              subtitle="Add credits & subscriptions"
              color="#FF9800"
              onPress={() => navigation.navigate('Wallet')}
            />
          </View>

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Last SOS Alert</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
            <View style={styles.activityContent}>
              <View style={styles.activityIcon}>
                <MaterialIcons name="emergency" size={20} color="#D62828" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityText}>Voice SOS triggered</Text>
                <Text style={styles.activitySubtext}>Ambulance arrived in 8 mins</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All History</Text>
              <Feather name="chevron-right" size={16} color="#D62828" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  time: {
    fontSize: 14,
    color: '#A0A4B8',
    fontFamily: 'Poppins_400Regular',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#D62828',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E253B',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  locationText: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
    fontFamily: 'Poppins_500Medium',
  },
  emergencyContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emergencyButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#D62828',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 10,
  },
  emergencyTouchable: {
    flex: 1,
    borderRadius: 90,
    overflow: 'hidden',
  },
  emergencyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'Poppins_700Bold',
  },
  emergencySubtext: {
    color: '#A0A4B8',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Poppins_600SemiBold',
  },
  actionSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  activityCard: {
    backgroundColor: '#1E253B',
    borderRadius: 12,
    padding: 15,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  activityTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  activityTime: {
    color: '#A0A4B8',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    backgroundColor: 'rgba(214, 40, 40, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  activitySubtext: {
    color: '#A0A4B8',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  viewAllText: {
    color: '#D62828',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default HomeScreen;