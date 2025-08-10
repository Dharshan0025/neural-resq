import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VolunteersScreen = () => {
  const navigation = useNavigation();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVolunteer, setIsVolunteer] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    setTimeout(() => {
      setVolunteers([
        {
          id: 1,
          name: 'Dr. Ananya Sharma',
          role: 'Medical Volunteer',
          distance: '0.8 km',
          rating: 4.9,
          skills: ['First Aid', 'CPR Certified'],
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          id: 2,
          name: 'Rahul Patel',
          role: 'Community Responder',
          distance: '1.2 km',
          rating: 4.7,
          skills: ['Emergency Transport', 'AED Trained'],
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          id: 3,
          name: 'Priya Singh',
          role: 'Paramedic',
          distance: '2.5 km',
          rating: 4.8,
          skills: ['Advanced Life Support', 'Wound Care'],
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderVolunteerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.volunteerCard}
      onPress={() => navigation.navigate('VolunteerDetail', { volunteer: item })}
    >
      <View style={styles.volunteerHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.volunteerInfo}>
          <Text style={styles.volunteerName}>{item.name}</Text>
          <Text style={styles.volunteerRole}>{item.role}</Text>
          <View style={styles.distanceContainer}>
            <Ionicons name="location-sharp" size={14} color="#D62828" />
            <Text style={styles.distanceText}>{item.distance} away</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={18} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.skillsContainer}>
        {item.skills.map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.callButton}>
          <FontAwesome5 name="phone" size={16} color="white" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-ellipses" size={16} color="#0077B6" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Nearby Volunteers</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Volunteer Toggle */}
      <TouchableOpacity 
        style={styles.volunteerToggle}
        onPress={() => setIsVolunteer(!isVolunteer)}
      >
        <Text style={styles.toggleText}>
          {isVolunteer ? 'I am a responder' : 'Become a responder'}
        </Text>
        <View style={[styles.toggleSwitch, isVolunteer && styles.toggleActive]}>
          <View style={[styles.toggleKnob, isVolunteer && styles.toggleKnobActive]} />
        </View>
      </TouchableOpacity>

      {/* Volunteer List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D62828" />
        </View>
      ) : (
        <FlatList
          data={volunteers}
          renderItem={renderVolunteerItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  volunteerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: 'rgba(214, 40, 40, 0.2)',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#999',
  },
  toggleKnobActive: {
    backgroundColor: '#D62828',
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  volunteerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  volunteerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  volunteerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  volunteerRole: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Poppins_400Regular',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#D62828',
    marginLeft: 4,
    fontFamily: 'Poppins_500Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#0077B6',
    fontFamily: 'Poppins_500Medium',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#D62828',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  callButtonText: {
    color: 'white',
    marginLeft: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  messageButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  messageButtonText: {
    color: '#0077B6',
    marginLeft: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default VolunteersScreen;