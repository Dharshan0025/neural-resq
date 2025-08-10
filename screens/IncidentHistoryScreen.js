

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const IncidentHistoryScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with API call
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      type: 'SOS',
      status: 'completed',
      date: 'Today, 10:45 AM',
      responseTime: '8 mins',
      hospital: 'City General Hospital',
      ambulance: 'KA01AB1234 (BLS)',
      rating: 4,
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      type: 'Ambulance',
      status: 'completed',
      date: 'Yesterday, 2:30 PM',
      responseTime: '12 mins',
      hospital: 'Metro Medical Center',
      ambulance: 'KA02CD4567 (ALS)',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 3,
      type: 'Volunteer',
      status: 'cancelled',
      date: 'Mar 15, 9:15 AM',
      responseTime: '5 mins',
      volunteer: 'Dr. Ananya Sharma',
      rating: null,
      image: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    {
      id: 4,
      type: 'SOS',
      status: 'completed',
      date: 'Mar 12, 5:45 PM',
      responseTime: '15 mins',
      hospital: 'Rural Health Clinic',
      ambulance: 'KA03EF7890 (BLS)',
      rating: 3,
      image: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
  ]);

  const filteredIncidents = activeFilter === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.type.toLowerCase() === activeFilter);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const renderIncidentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.incidentCard}
      onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
    >
      <View style={styles.incidentHeader}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.incidentInfo}>
          <View style={styles.incidentTypeRow}>
            <Text style={[
              styles.incidentType,
              item.type === 'SOS' && styles.typeSOS,
              item.type === 'Ambulance' && styles.typeAmbulance,
              item.type === 'Volunteer' && styles.typeVolunteer
            ]}>
              {item.type}
            </Text>
            <Text style={[
              styles.incidentStatus,
              item.status === 'completed' && styles.statusCompleted,
              item.status === 'cancelled' && styles.statusCancelled
            ]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.incidentDate}>{item.date}</Text>
          <Text style={styles.incidentResponse}>Response time: {item.responseTime}</Text>
        </View>
        <MaterialIcons 
          name="keyboard-arrow-right" 
          size={24} 
          color="#777" 
        />
      </View>

      <View style={styles.incidentDetails}>
        {item.hospital && (
          <View style={styles.detailRow}>
            <FontAwesome name="hospital-o" size={16} color="#0077B6" />
            <Text style={styles.detailText}>{item.hospital}</Text>
          </View>
        )}
        {item.ambulance && (
          <View style={styles.detailRow}>
            <FontAwesome name="ambulance" size={16} color="#D62828" />
            <Text style={styles.detailText}>{item.ambulance}</Text>
          </View>
        )}
        {item.volunteer && (
          <View style={styles.detailRow}>
            <Ionicons name="person" size={16} color="#4CAF50" />
            <Text style={styles.detailText}>{item.volunteer}</Text>
          </View>
        )}
      </View>

      {item.rating && (
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <MaterialIcons
              key={star}
              name={star <= item.rating ? 'star' : 'star-border'}
              size={20}
              color="#FFD700"
            />
          ))}
        </View>
      )}
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
        <Text style={styles.headerTitle}>Incident History</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'sos' && styles.activeFilter]}
          onPress={() => setActiveFilter('sos')}
        >
          <Text style={[styles.filterText, activeFilter === 'sos' && styles.activeFilterText]}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'ambulance' && styles.activeFilter]}
          onPress={() => setActiveFilter('ambulance')}
        >
          <Text style={[styles.filterText, activeFilter === 'ambulance' && styles.activeFilterText]}>Ambulance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'volunteer' && styles.activeFilter]}
          onPress={() => setActiveFilter('volunteer')}
        >
          <Text style={[styles.filterText, activeFilter === 'volunteer' && styles.activeFilterText]}>Volunteer</Text>
        </TouchableOpacity>
      </View>

      {/* Incident List */}
      <FlatList
        data={filteredIncidents}
        renderItem={renderIncidentItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={50} color="#D62828" />
            <Text style={styles.emptyText}>No incidents found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    elevation: 3,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#D62828',
  },
  filterText: {
    color: '#777',
    fontFamily: 'Poppins_500Medium',
  },
  activeFilterText: {
    color: 'white',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    marginTop: 10,
    fontFamily: 'Poppins_500Medium',
  },
  incidentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  incidentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  incidentTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
  typeSOS: {
    color: '#D62828',
  },
  typeAmbulance: {
    color: '#0077B6',
  },
  typeVolunteer: {
    color: '#4CAF50',
  },
  incidentStatus: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontFamily: 'Poppins_500Medium',
  },
  statusCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: '#4CAF50',
  },
  statusCancelled: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    color: '#F44336',
  },
  incidentDate: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Poppins_400Regular',
  },
  incidentResponse: {
    fontSize: 13,
    color: '#555',
    marginTop: 3,
    fontFamily: 'Poppins_500Medium',
  },
  incidentDetails: {
    marginLeft: 65,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    fontFamily: 'Poppins_400Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginLeft: 65,
    marginTop: 5,
  },
});

export default IncidentHistoryScreen;